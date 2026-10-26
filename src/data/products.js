// export const products = [
//   {
//     id: 1,
//     name: "Aura Sound Pro Wireless Headphones",
//     tagline: "Acoustique haute fidélité avec réduction active du bruit",
//     price: 18900.0,
//     originalPrice: 24500.0,
//     category: "Audio",
//     inStock: true,
//     stockCount: 18,
//     image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
//     description: "Immergez-vous dans un son riche et équilibré. Le casque Aura Sound Pro offre des basses profondes et des aigus cristallins avec jusqu'à 40 heures d'autonomie continue.",
//     features: [
//       "Réduction active du bruit hybride (ANC)",
//       "Autonomie de 40 heures avec charge rapide USB-C",
//       "Multipoint Bluetooth 5.3",
//       "Coussinets à mémoire de forme pour un confort durable"
//     ],
//     colors: [
//       {
//         name: "Noir Sidéral / Black",
//         code: "#18181b",
//         image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
//       },
//       {
//         name: "Argent Stellaire / Silver",
//         code: "#e4e4e7",
//         image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
//       },
//       {
//         name: "Bleu Minuit / Midnight Navy",
//         code: "#1e3a8a",
//         image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
//       }
//     ],
//     specs: {
//       "Autonomie": "40 Heures",
//       "Connectivité": "Bluetooth 5.3 / Jack 3.5mm",
//       "Garantie": "12 Mois"
//     }
//   },
//   {
//     id: 2,
//     name: "Montre Connectée Minimalist Chrono",
//     tagline: "Élégance moderne avec suivi de santé complet et écran AMOLED",
//     price: 14500.0,
//     originalPrice: 18900.0,
//     category: "Wearables",
//     inStock: true,
//     stockCount: 24,
//     image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
//     description: "Conçue pour le quotidien, la montre Chrono combine écran AMOLED Always-On, suivi de la fréquence cardiaque, SpO2, étanchéité 5ATM et 14 jours d'autonomie.",
//     features: [
//       "Écran AMOLED 1.43\" haute définition Always-On",
//       "Suivi cardiofréquencemètre et sommeil en temps réel",
//       "Résistance à l'eau 5ATM (50 mètres)",
//       "Boîtier monocoque en acier inoxydable"
//     ],
//     colors: [
//       {
//         name: "Noir Intense / Deep Black",
//         code: "#09090b",
//         image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
//       },
//       {
//         name: "Argent Pur / Pure Silver",
//         code: "#d1d5db",
//         image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
//       }
//     ],
//     specs: {
//       "Écran": "1.43\" AMOLED",
//       "Batterie": "Jusqu'à 14 jours",
//       "Compatibilité": "Android et iOS"
//     }
//   },
//   {
//     id: 3,
//     name: "Clavier Mécanique Rétro Lumix",
//     tagline: "Frappe tactile satisfaisante avec touches interchangeables",
//     price: 11900.0,
//     originalPrice: 14900.0,
//     category: "Tech & Office",
//     inStock: true,
//     stockCount: 12,
//     image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
//     description: "Format compact 75%, switches mécaniques prélubrifiés, rétroéclairage RGB personnalisé et triple connectivité sans fil.",
//     features: [
//       "Switches mécaniques tactiles remplaçables à chaud",
//       "Triple mode : Sans fil 2.4GHz, Bluetooth 5.0, Câble USB-C",
//       "Rétroéclairage RGB touche par touche",
//       "Touches double-shot en PBT haute durabilité"
//     ],
//     colors: [
//       {
//         name: "Gris Vintage / Vintage Gray",
//         code: "#71717a",
//         image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
//       },
//       {
//         name: "Blanc Neige / Pure White",
//         code: "#f4f4f5",
//         image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
//       }
//     ],
//     specs: {
//       "Disposition": "75% Compact (84 touches)",
//       "Batterie": "4000 mAh rechargeable"
//     }
//   },
//   {
//     id: 4,
//     name: "Housse Ordinateur Cuir Nomad",
//     tagline: "Protection artisanale pour ordinateurs portables 13-14 pouces",
//     price: 6500.0,
//     originalPrice: 8500.0,
//     category: "Accessories",
//     inStock: true,
//     stockCount: 35,
//     image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
//     description: "Confectionnée en cuir de qualité supérieure avec doublure intérieure en microfibre douce anti-rayures et fermeture magnétique sécurisée.",
//     features: [
//       "Cuir véritable pleine fleur",
//       "Doublure intérieure en micro-suède douce",
//       "Fermeture magnétique invisible"
//     ],
//     colors: [
//       {
//         name: "Marron Cuir / Tan Brown",
//         code: "#78350f",
//         image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
//       },
//       {
//         name: "Noir Classique / Classic Black",
//         code: "#1c1917",
//         image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
//       }
//     ],
//     specs: {
//       "Compatibilité": "13\" - 14\" Laptops",
//       "Matière": "Cuir véritable"
//     }
//   },
//   {
//     id: 5,
//     name: "Écouteurs Sans Fil Zenith TWS",
//     tagline: "Son dynamique avec boîtier compact et charge sans fil Qi",
//     price: 8500.0,
//     originalPrice: 11000.0,
//     category: "Audio",
//     inStock: true,
//     stockCount: 40,
//     image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
//     description: "Haut-parleurs 11mm en titane, réduction des bruits ambiants lors des appels et jusqu'à 32 heures d'écoute totale.",
//     features: [
//       "Drivers titane 11mm dynamiques",
//       "Résistance IPX5 contre la sueur et les éclaboussures",
//       "32 heures d'autonomie totale avec étui",
//       "Charge sans fil Qi & USB-C rapide"
//     ],
//     colors: [
//       {
//         name: "Blanc Brillant / Glossy White",
//         code: "#f8fafc",
//         image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
//       },
//       {
//         name: "Noir Carbone / Carbon Black",
//         code: "#0f172a",
//         image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80"
//       }
//     ],
//     specs: {
//       "Autonomie": "32h au total",
//       "Étanchéité": "IPX5"
//     }
//   },
//   {
//     id: 6,
//     name: "Souris Ergonomique Sans Fil Apex",
//     tagline: "Posture naturelle pour un confort de travail optimal toute la journée",
//     price: 7900.0,
//     originalPrice: 9900.0,
//     category: "Tech & Office",
//     inStock: true,
//     stockCount: 15,
//     image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
//     description: "Angle vertical naturel de 57 degrés pour réduire la fatigue musculaire du poignet, capteur optique précis 4000 DPI et clics silencieux.",
//     features: [
//       "Angle ergonomique scientifique de 57°",
//       "Double connexion : Bluetooth et récepteur USB 2.4GHz",
//       "Capteur optique haute précision réglable 4000 DPI",
//       "Boutons whisper-quiet silencieux"
//     ],
//     colors: [
//       {
//         name: "Gris Graphite / Graphite",
//         code: "#334155",
//         image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
//       },
//       {
//         name: "Blanc Arctique / Arctic White",
//         code: "#e2e8f0",
//         image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
//       }
//     ],
//     specs: {
//       "DPI": "400 - 4000 DPI",
//       "Batterie": "Rechargeable Li-Po"
//     }
//   }
// ];
