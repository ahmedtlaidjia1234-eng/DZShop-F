import { jsPDF } from 'jspdf';

export function generateOrderPDF(order, siteSettings = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const siteName = siteSettings.siteName || 'AURA COMMERCE';
  const currency = siteSettings.currency || 'DZD';
  const customer = order.customer || {};
  const items = order.items || [];
  const subtotal = Number(order.subtotal || 0);
  const shipping = Number(order.shipping ?? customer.deliveryFee ?? 0);
  const total = Number(order.total || subtotal + shipping);

  // Background Header Banner
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 36, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(siteName, 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text('BON DE COMMANDE / FACTURE CLIENT', 14, 25);
  doc.text('Livraison 58 Wilayas d\'Algerie - Paiement a la livraison', 14, 30);

  // Order Number & Date (Right aligned in header)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(250, 204, 21); // yellow
  doc.text(`COMMANDE #${order.id}`, 196, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-DZ') : new Date().toLocaleDateString('fr-DZ');
  doc.text(`Date : ${orderDate}`, 196, 25, { align: 'right' });
  doc.text('Mode : Cash on Delivery (Especes)', 196, 30, { align: 'right' });

  // Customer Information Box
  let y = 46;
  doc.setFillColor(241, 245, 249); // #f1f5f9
  doc.roundedRect(14, y, 182, 34, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225); // #cbd5e1
  doc.roundedRect(14, y, 182, 34, 3, 3, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DESTINATAIRE & LIVRAISON', 20, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  doc.text(`Nom : ${customer.name || 'Client'}`, 20, y + 15);
  doc.text(`Telephone : ${customer.phone || 'Non specifie'}`, 20, y + 21);
  doc.text(`Wilaya : ${customer.wilaya || customer.wilayaStr || 'Algerie (58 Wilayas)'}`, 20, y + 27);

  const cleanLocation = (customer.location || '').slice(0, 55);
  doc.text(`Adresse : ${cleanLocation}`, 110, y + 15);
  if (customer.notes) {
    const cleanNotes = customer.notes.slice(0, 50);
    doc.text(`Note : "${cleanNotes}"`, 110, y + 21);
  }

  // Items Table Header
  y = 90;
  doc.setFillColor(30, 41, 59); // #1e293b
  doc.rect(14, y, 182, 9, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Article / Produit', 18, y + 6);
  doc.text('Qte', 120, y + 6, { align: 'center' });
  doc.text('Prix Unit.', 150, y + 6, { align: 'right' });
  doc.text('Total', 190, y + 6, { align: 'right' });

  // Items List
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 2, 182, 11, 'F');
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const itemName = (item.name || 'Produit').slice(0, 45);
    doc.text(itemName, 18, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    if (item.selectedColor?.name) {
      doc.setTextColor(99, 102, 241);
      doc.text(`Couleur : ${item.selectedColor.name}`, 18, y + 7);
      doc.setTextColor(30, 41, 59);
    }

    doc.setFontSize(9);
    doc.text(String(item.quantity || 1), 120, y + 4, { align: 'center' });
    doc.text(`${Number(item.price || 0).toLocaleString()} ${currency}`, 150, y + 4, { align: 'right' });
    const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);
    doc.text(`${itemTotal.toLocaleString()} ${currency}`, 190, y + 4, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 9, 196, y + 9);
    y += 11;
  });

  // Financial Breakdown Box
  y += 6;
  const breakdownX = 120;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text('Sous-total :', breakdownX, y);
  doc.text(`${subtotal.toLocaleString()} ${currency}`, 190, y, { align: 'right' });

  y += 7;
  const wilayaLabel = customer.wilaya ? `Frais Livraison (${customer.wilaya}) :` : 'Frais de Livraison :';
  doc.text(wilayaLabel, breakdownX, y);
  doc.text(`${shipping.toLocaleString()} ${currency}`, 190, y, { align: 'right' });

  y += 3;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(breakdownX, y, 196, y);

  y += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL A PAYER :', breakdownX, y);
  doc.setTextColor(22, 101, 52); // green #166534
  doc.text(`${total.toLocaleString()} ${currency}`, 190, y, { align: 'right' });

  // Security & COD Notice Banner at bottom
  y = Math.max(y + 20, 245);
  doc.setFillColor(240, 253, 244); // #f0fdf4
  doc.roundedRect(14, y, 182, 20, 3, 3, 'F');
  doc.setDrawColor(134, 239, 172); // #86efac
  doc.roundedRect(14, y, 182, 20, 3, 3, 'D');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('PAIEMENT EN ESPECES A LA LIVRAISON (CASH ON DELIVERY)', 105, y + 7, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52);
  doc.text('Vous reglerez le montant total directement au livreur apres reception et inspection de votre colis.', 105, y + 13, { align: 'center' });

  // Footer Copyright
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Document genere automatiquement par ${siteName} · Merci de votre confiance !`, 105, 285, { align: 'center' });

  return doc;
}

export function downloadOrderPDF(order, siteSettings = {}) {
  try {
    const doc = generateOrderPDF(order, siteSettings);
    const fileName = `commande-${order.id || 'AURA'}.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return false;
  }
}
