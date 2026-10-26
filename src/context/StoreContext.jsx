import { useState, useEffect } from 'react';
import { StoreContext } from './StoreContextInstance';
// import { products as defaultProducts } from '../data/products';
import {
  fetchProductsAPI,
  fetchSettingsAPI,
  fetchOrdersAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  updateSettingsAPI,
  submitOrderAPI,
  updateOrderStatusAPI,
  deleteOrderAPI,
  loginAdminAPI,
  updateAdminProfileAPI,
  logoutAdmin,
  getStoredAdminUser,
  checkBackendHealth,
  uploadImageAPI,
} from '../services/api';

const DEFAULT_SETTINGS = {
  siteName: 'AURA',
  siteSubtitle: 'COMMERCE',
  siteTagline: 'Boutique en ligne en Algérie - Livraison 58 Wilayas',
  announcement: '🚚 Livraison rapide vers 58 Wilayas d\'Algérie ! Paiement à la livraison.',
  showAnnouncement: true,
  contactEmail: 'contact@auracommerce.com',
  orderNotificationEmail: 'admin@auracommerce.com',
  currency: 'DZD',
  categories: ['Audio', 'Wearables', 'Tech & Office', 'Accessories', 'Vêtements', 'Lifestyle'],
  seoMetaTitle: 'AURA Commerce | Vente en ligne en Algérie - DZD',
  seoMetaDescription: 'Achetez vos produits préférés en ligne en Algérie avec paiement à la livraison à domicile sur 58 wilayas.',
  seoKeywords: 'achat en ligne, e-commerce algerie, livraison 58 wilayas, dzd, dinar algerien, paiement a la livraison',
  offerEnabled: true,
  offerTitle: 'Offre Spéciale : Casque Sans Fil Aura Pro',
  offerSubtitle: 'Profitez d\'une réduction immédiate de 20% valable cette semaine !',
  offerDiscount: '-20%',
  offerProductId: 1,
  offerBadge: 'OFFRE DU MOMENT',
  offerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
};

export function StoreProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_site_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminUser, setAdminUser] = useState(() => getStoredAdminUser());
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [databaseEngine, setDatabaseEngine] = useState('Checking...');
  const [notification, setNotification] = useState(null);

  const notify = (msg, isError = false) => {
    setNotification({ text: msg, isError });
    setTimeout(() => {
      setNotification((curr) => (curr?.text === msg ? null : curr));
    }, 4000);
  };

  // Sync with Backend Database on Mount
  const syncWithBackend = async () => {
    try {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        setIsBackendOnline(false);
        setDatabaseEngine('Local Cache');
        return;
      }

      setIsBackendOnline(true);

      const settingsResult = await fetchSettingsAPI();
      if (settingsResult?.settings) {
        setSiteSettings(settingsResult.settings);
        setDatabaseEngine(settingsResult.system?.databaseEngine || 'MySQL 8.0');
        try {
          localStorage.setItem('aura_site_settings', JSON.stringify(settingsResult.settings));
        } catch {}
      }

      const remoteProducts = await fetchProductsAPI();
      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        setProducts(remoteProducts);
        try {
          localStorage.setItem('aura_products', JSON.stringify(remoteProducts));
        } catch {}
      }

      if (localStorage.getItem('aura_admin_token')) {
        try {
          const remoteOrders = await fetchOrdersAPI();
          if (Array.isArray(remoteOrders)) {
            setOrders(remoteOrders);
            try {
              localStorage.setItem('aura_orders', JSON.stringify(remoteOrders));
            } catch {}
          }
        } catch {}
      }
    } catch (err) {
      console.warn('Backend sync error:', err);
      setIsBackendOnline(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      syncWithBackend();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ==============================================================================
  // BACKEND-FIRST MUTATIONS:
  // "make all the requests for adding a product or any thing if the request to the backend got there and everything is working in the backend side then update the front end localStorage"
  // ==============================================================================

  // 1. Update Site Settings (Backend-First)
  const updateSiteSettings = async (newSettings) => {
    try {
      const updatedBackendSettings = await updateSettingsAPI(newSettings);
      // ONLY on backend success: update state & localStorage
      const merged = { ...siteSettings, ...updatedBackendSettings };
      setSiteSettings(merged);
      localStorage.setItem('aura_site_settings', JSON.stringify(merged));
      notify('Paramètres enregistrés dans la base de données MySQL !');
      return merged;
    } catch (err) {
      notify(`Erreur lors de la mise à jour : ${err.message}`, true);
      throw err;
    }
  };

  const resetSiteSettings = async () => {
    try {
      await updateSettingsAPI(DEFAULT_SETTINGS);
      setSiteSettings(DEFAULT_SETTINGS);
      localStorage.setItem('aura_site_settings', JSON.stringify(DEFAULT_SETTINGS));
      notify('Paramètres réinitialisés avec succès.');
    } catch (err) {
      notify(`Erreur de réinitialisation : ${err.message}`, true);
    }
  };

  // 2. Add Product (Backend-First)
  const addProduct = async (productData) => {
    try {
      const created = await createProductAPI(productData);
      // ONLY on backend success: update state & localStorage
      setProducts((prev) => {
        const next = [created, ...prev];
        localStorage.setItem('aura_products', JSON.stringify(next));
        return next;
      });
      notify(`Produit "${created.name}" enregistré dans la base de données !`);
      return created;
    } catch (err) {
      notify(`Erreur d'ajout de produit : ${err.message}`, true);
      throw err;
    }
  };

  // 3. Update Product (Backend-First)
  const updateProduct = async (id, updatedFields) => {
    try {
      const updated = await updateProductAPI(id, updatedFields);
      // ONLY on backend success: update state & localStorage
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === id ? updated : p));
        localStorage.setItem('aura_products', JSON.stringify(next));
        return next;
      });
      notify(`Produit "${updated.name}" mis à jour dans la base de données !`);
      return updated;
    } catch (err) {
      notify(`Erreur de modification du produit : ${err.message}`, true);
      throw err;
    }
  };

  // 4. Delete Product (Backend-First)
  const deleteProduct = async (id) => {
    try {
      await deleteProductAPI(id);
      // ONLY on backend success: update state & localStorage
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        localStorage.setItem('aura_products', JSON.stringify(next));
        return next;
      });
      notify('Produit supprimé de la base de données.');
    } catch (err) {
      notify(`Erreur lors de la suppression : ${err.message}`, true);
      throw err;
    }
  };

  const resetProducts = async () => {
    try {
      // Re-seed default sample products to backend
      for (const prod of defaultProducts) {
        await createProductAPI(prod);
      }
      await syncWithBackend();
      notify('Catalogue réinitialisé.');
    } catch {
      setProducts(defaultProducts);
      localStorage.setItem('aura_products', JSON.stringify(defaultProducts));
    }
  };

  // 5. Checkout / Create Order (Backend-First)
  const createOrder = async (orderData) => {
    try {
      const created = await submitOrderAPI(orderData);
      // ONLY on backend success: update state & localStorage
      setOrders((prev) => {
        const next = [created, ...prev];
        localStorage.setItem('aura_orders', JSON.stringify(next));
        return next;
      });
      notify(`Commande #${created.id} enregistrée dans MySQL !`);
      return created;
    } catch (err) {
      notify(`Erreur lors de la commande : ${err.message}`, true);
      throw err;
    }
  };

  // 6. Update Order Status (Backend-First)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      // ONLY on backend success: update state & localStorage
      setOrders((prev) => {
        const next = prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
        localStorage.setItem('aura_orders', JSON.stringify(next));
        return next;
      });
      notify(`Statut de la commande #${orderId} mis à jour : ${newStatus}.`);
    } catch (err) {
      notify(`Erreur de mise à jour du statut : ${err.message}`, true);
      throw err;
    }
  };

  // 7. Delete Order (Backend-First)
  const deleteOrder = async (orderId) => {
    try {
      await deleteOrderAPI(orderId);
      // ONLY on backend success: update state & localStorage
      setOrders((prev) => {
        const next = prev.filter((ord) => ord.id !== orderId);
        localStorage.setItem('aura_orders', JSON.stringify(next));
        return next;
      });
      notify(`Commande #${orderId} supprimée.`);
    } catch (err) {
      notify(`Erreur de suppression de la commande : ${err.message}`, true);
      throw err;
    }
  };

  // Admin Authentication
  const handleAdminLogin = async (username, password) => {
    try {
      console.log(username, password);
      const result = await loginAdminAPI(username, password);
      setAdminUser(result.user);
      notify(`Bienvenue ${result.user.username} ! Authentifié avec succès.`);
      await syncWithBackend();
      return result;
    } catch (err) {
      notify(`Erreur d'authentification : ${err.message}`, true);
      throw err;
    }
  };
 
  // Update Admin Profile (Username & Password)
  const handleUpdateAdminProfile = async (profileData) => {
    try {
      const result = await updateAdminProfileAPI(profileData);
      setAdminUser(result.user);
      notify('Identifiants de sécurité de l\'administrateur mis à jour !');
      return result;
    } catch (err) {
      notify(`Erreur : ${err.message}`, true);
      throw err;
    }
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    notify('Déconnexion effectuée.');
  };

  // Device Image Upload helper
  const uploadImage = async (file) => {
    try {
      const url = await uploadImageAPI(file);
      notify('Photo téléchargée avec succès !');
      return url;
    } catch (err) {
      notify(`Erreur de téléchargement d'image : ${err.message}`, true);
      throw err;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        notification,
        setNotification,
        isBackendOnline,
        databaseEngine,
        syncWithBackend,
        adminUser,
        adminLogin: handleAdminLogin,
        adminLogout: handleAdminLogout,
        updateAdminProfile: handleUpdateAdminProfile,
        uploadImage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
