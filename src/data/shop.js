// The shop's address, in ONE place, for text that cannot read your Admin settings (printed order sheets,
// order-status messages). The footer, contact page, checkout and emails read Admin → Appearance first.
// If the address ever changes: update Admin → Appearance, and also this file.
export const SHOP = {
  street: '6033 Shawson Dr, Unit 40',
  cityLine: 'Mississauga, ON L5T 1H8',
};
export const SHOP_FULL = `${SHOP.street}, ${SHOP.cityLine}`;
