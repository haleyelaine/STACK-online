// Accepts an array of jumper objects and builds a group cart
export function buildCartFromJumpers(jumpers) {
  const cart = [];

  jumpers.forEach((jumper) => {
    const { id, name, jump_type, media_options = [], weight } = jumper;

    if (jump_type) {
      cart.push({
        jumperId: id,
        jumperName: name,
        product: jump_type,
        quantity: 1,
        price_each: jump_type.price,
      });
    }

    for (const media of media_options) {
      cart.push({
        jumperId: id,
        jumperName: name,
        product: media,
        quantity: 1,
        price_each: media.price,
      });
    }

    if (weight >= 220 && weight < 240) {
      cart.push({
        jumperId: id,
        jumperName: name,
        product: { id: 'weight_fee1', name: 'Weight Fee (220-239lbs)', price: 20 },
        quantity: 1,
        price_each: 20,
      });
    } else if (weight >= 240) {
      cart.push({
        jumperId: id,
        jumperName: name,
        product: { id: 'weight_fee2', name: 'Weight Fee (240+lbs)', price: 40 },
        quantity: 1,
        price_each: 40,
      });
    }
  });

  return cart;
}
