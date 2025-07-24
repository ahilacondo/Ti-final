const Stakeholder = artifacts.require("Stakeholder");
const Farmer = artifacts.require("Farmer");
const Manufacturer = artifacts.require("Manufacturer");
const Product = artifacts.require("Product");
const Main = artifacts.require("Main");

module.exports = async (callback) => {

  const accounts = await web3.eth.getAccounts();

  let stakeholderContract = await Stakeholder.deployed();
  let farmerContract = await Farmer.deployed();
  let manufacturerContract = await Manufacturer.deployed();
  let productContract = await Product.deployed();
  let mainContract = await Main.deployed(farmerContract.address, manufacturerContract.address, stakeholderContract.address);

  const admin = accounts[0];
  const farmer1 = accounts[1];
  const farmer2 = accounts[2];
  const manufacturer1 = accounts[3];
  const manufacturer2 = accounts[4];
  const distributer = accounts[5];
  const retailer1 = accounts[6];
  const retailer2 = accounts[7];
  const consumer1 = accounts[8];
  const consumer2 = accounts[9];

  await stakeholderContract.register("Admin", "Internet", "admin", { from: admin });
  await farmerContract.registerFarmer("Juan Quispe", "Valle del Colca, Arequipa", "farmer", ["Papa", "Maíz", "Quinua", "Ají", "Anís"], { from: farmer1 });
  await farmerContract.registerFarmer("Rosa Mamani", "Majes, Arequipa", "farmer", ["Leche", "Alpaca", "Trigo", "Cebada", "Tomate"], { from: farmer2 });
  await manufacturerContract.register("La Ibérica", "Uxbridge, Arequipa, Perú", "manufacturer", { from: manufacturer1 });
  await manufacturerContract.register("Gloria", "Vevey, Majes, Arequipa", "manufacturer", { from: manufacturer2 });
  await stakeholderContract.register("Distribuidora Arequipa", "Cercado, Arequipa", "distributer", { from: distributer });
  await stakeholderContract.register("Mercado San Camilo", "José Luis Bustamante y Rivero, Arequipa", "retailer", { from: retailer1 });
  await stakeholderContract.register("Mercado Avelino", "José Luis Bustamante y Rivero, Arequipa", "retailer", { from: retailer2 });
  await stakeholderContract.register("Pedro Huamani", "José Luis Bustamante y Rivero, Arequipa", "consumer", { from: consumer1 });
  await stakeholderContract.register("Lucía Nina", "José Luis Bustamante y Rivero, Arequipa", "consumer", { from: consumer2 });

  console.log(await farmerContract.getFarmer(farmer1, { from: farmer1 }));
  console.log(await farmerContract.getFarmer(farmer2, { from: farmer2 }));
  console.log(await manufacturerContract.get(manufacturer1, { from: manufacturer1 }));
  console.log(await manufacturerContract.get(manufacturer2, { from: manufacturer2 }));
  console.log(await stakeholderContract.get(distributer, { from: distributer }));
  console.log(await stakeholderContract.get(retailer1, { from: retailer1 }));
  console.log(await stakeholderContract.get(retailer2, { from: retailer2 }));
  console.log(await stakeholderContract.get(consumer1, { from: consumer1 }));
  console.log(await stakeholderContract.get(consumer2, { from: consumer2 }));
  console.log(await farmerContract.getRawProductFarmers("Papa", { from: farmer1 }));
  
  await farmerContract.verify(farmer2, { from: admin });
  console.log(await farmerContract.isVerified(farmer2, { from: farmer2 }));

  //1st manufacturer
  await manufacturerContract.addRawProduct("Papa", [
    {
      id: farmer1,
      isVerified: await farmerContract.isVerified(farmer1, { from: farmer1 })
    },
    {
      id: farmer2,
      isVerified: await farmerContract.isVerified(farmer2, { from: farmer2 })
    }
  ], { from: manufacturer1 });
  await manufacturerContract.addRawProduct("Leche", [
    {
      id: farmer1,
      isVerified: await farmerContract.isVerified(farmer1, { from: farmer1 })
    },
  ], { from: manufacturer1 });
  await manufacturerContract.addRawProduct("Trigo", [
    {
      id: farmer2,
      isVerified: await farmerContract.isVerified(farmer2, { from: farmer2 })
    },
  ], { from: manufacturer1 });
  await manufacturerContract.addRawProduct("Maíz", [
    {
      id: farmer1,
      isVerified: await farmerContract.isVerified(farmer1, { from: farmer1 })
    },
    {
      id: farmer2,
      isVerified: await farmerContract.isVerified(farmer2, { from: farmer2 })
    }
  ], { from: manufacturer1 });
  await manufacturerContract.addRawProduct("Ají", [
    {
      id: farmer1,
      isVerified: await farmerContract.isVerified(farmer1, { from: farmer1 })
    },
  ], { from: manufacturer1 });

  //2nd Manufacturer
  await manufacturerContract.addRawProduct("Papa", [
    {
      id: farmer2,
      isVerified: await farmerContract.isVerified(farmer2, { from: farmer2 })
    },
  ], { from: manufacturer2 });
  await manufacturerContract.addRawProduct("Quinua", [
    {
      id: farmer1,
      isVerified: await farmerContract.isVerified(farmer1, { from: farmer1 })
    },
  ], { from: manufacturer2 });
  await manufacturerContract.addRawProduct("Cebada", [
    {
      id: farmer2,
      isVerified: await farmerContract.isVerified(farmer2, { from: farmer2 })
    },
  ], { from: manufacturer2 });
  await manufacturerContract.addRawProduct("Tomate", [
    {
      id: farmer2,
      isVerified: await farmerContract.isVerified(farmer2, { from: farmer2 })
    },
  ], { from: manufacturer2 });

  //Manufacturer1 Launch Product
  let manufacturer1RawProducts = await manufacturerContract.getManufacturerRawProductDetails(manufacturer1, { from: manufacturer1 });
  manufacturer1RawProductsMap = {};
  for (let i = 0; i < manufacturer1RawProducts.length; i++) {
    manufacturer1RawProductsMap[manufacturer1RawProducts[i].name] = manufacturer1RawProducts[i].isVerified;
  }
  console.log(manufacturer1RawProductsMap);

  console.log(await manufacturerContract.getManufacturer(manufacturer1, {from : admin}));

  await productContract.add(
    12091, 
    "Chocolate La Ibérica", 
    [
      {
        name: "Leche",
        isVerified: manufacturer1RawProductsMap["Leche"]
      },
      {
        name: "Maíz",
        isVerified: manufacturer1RawProductsMap["Maíz"]
      },
      {
        name: "Trigo",
        isVerified: manufacturer1RawProductsMap["Trigo"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423804/Supply%20Chain/Product%20images/dairy_milk_cadbury_k5ihc3.jpg",
    {from: manufacturer1}
  );
  await manufacturerContract.launchProduct(12091, {from: manufacturer1});

  await productContract.add(
    12092, 
    "Turrón de Arequipa", 
    [
      {
        name: "Leche",
        isVerified: manufacturer1RawProductsMap["Leche"]
      },
      {
        name: "Maíz",
        isVerified: manufacturer1RawProductsMap["Maíz"]
      },
      {
        name: "Trigo",
        isVerified: manufacturer1RawProductsMap["Trigo"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423804/Supply%20Chain/Product%20images/5star_cadbury_emfynn.webp",
    {from: manufacturer1}
  );
  await manufacturerContract.launchProduct(12092, {from: manufacturer1});

  await productContract.add(
    12093, 
    "Queque de Quinua", 
    [
      {
        name: "Leche",
        isVerified: manufacturer1RawProductsMap["Leche"]
      },
      {
        name: "Maíz",
        isVerified: manufacturer1RawProductsMap["Maíz"]
      },
      {
        name: "Trigo",
        isVerified: manufacturer1RawProductsMap["Trigo"]
      },
      {
        name: "Ají",
        isVerified: manufacturer1RawProductsMap["Ají"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423804/Supply%20Chain/Product%20images/cake_cadbury_tw16tw.jpg",
    {from: manufacturer1}
  );
  await manufacturerContract.launchProduct(12093, {from: manufacturer1});

  //Manufacturer2 Launch Product

  let manufacturer2RawProducts = await manufacturerContract.getManufacturerRawProductDetails(manufacturer2, { from: manufacturer2 });
  manufacturer2RawProductsMap = {};
  for (let i = 0; i < manufacturer2RawProducts.length; i++) {
    manufacturer2RawProductsMap[manufacturer2RawProducts[i].name] = manufacturer2RawProducts[i].isVerified;
  }
  console.log(manufacturer2RawProductsMap);

  console.log(await manufacturerContract.getManufacturer(manufacturer2, {from : admin}));

  await productContract.add(
    22091, 
    "Queso Majes", 
    [
      {
        name: "Papa",
        isVerified: manufacturer2RawProductsMap["Leche"]
      },
      {
        name: "Maíz",
        isVerified: manufacturer2RawProductsMap["Maíz"]
      },
      {
        name: "Trigo",
        isVerified: manufacturer2RawProductsMap["Trigo"]
      }
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423805/Supply%20Chain/Product%20images/munch_nestle_lrjcal.jpg",
    {from: manufacturer2}
  );
  await manufacturerContract.launchProduct(22091, {from: manufacturer2});

  await productContract.add(
    22092, 
    "Ají de Huacatay", 
    [
      {
        name: "Tomate",
        isVerified: manufacturer2RawProductsMap["Tomate"]
      },
      {
        name: "Maíz",
        isVerified: manufacturer2RawProductsMap["Maíz"]
      },
    ],
    "https://res.cloudinary.com/dstmsi8qv/image/upload/v1652423805/Supply%20Chain/Product%20images/tomato_sauce_nestle_w1vsqg.jpg",
    {from: manufacturer2}
  );
  await manufacturerContract.launchProduct(22092, {from: manufacturer2});


  await productContract.transfer(distributer, 12091, {from: manufacturer1}); // El fabricante 1 transfiere al distribuidor
  await productContract.addReview(12091, 70, "Buen producto", {from: distributer}); // El distribuidor deja una reseña
  await productContract.transfer(retailer1, 12091, {from: distributer}); // El distribuidor transfiere al minorista 1
  await productContract.addReview(12091, 90, "Buena relación calidad-precio", {from: retailer1}); // Reseña del minorista
  await productContract.transfer(consumer1, 12091, {from: retailer1}); // El minorista transfiere al consumidor 1
  await productContract.addReview(12091, 60, "Útil", {from: consumer1}); // Reseña del consumidor
  console.log(await productContract.get(12091, {from: consumer1})); // Muestra los detalles del producto 12091
  
  await productContract.transfer(distributer, 12092, {from: manufacturer1});
  await productContract.addReview(12092, 80, "Buen producto", {from: distributer});
  await productContract.transfer(retailer1, 12092, {from: distributer});
  await productContract.addReview(12092, 90, "Buena relación calidad-precio", {from: retailer1});
  await productContract.transfer(consumer2, 12092, {from: retailer1});
  await productContract.addReview(12092, 100, "Buen sabor", {from: consumer2});
  console.log(await productContract.get(12092, {from: consumer2}));
  
  await productContract.transfer(distributer, 12093, {from: manufacturer1});
  await productContract.addReview(12093, 70, "Buen producto", {from: distributer});
  console.log(await productContract.get(12093, {from: consumer1}));
  
  await productContract.transfer(distributer, 22091, {from: manufacturer2});
  await productContract.addReview(22091, 70, "Buen producto", {from: distributer});
  await productContract.transfer(retailer2, 22091, {from: distributer});
  await productContract.addReview(22091, 90, "Buena relación calidad-precio", {from: retailer2});
  await productContract.transfer(consumer2, 22091, {from: retailer2});
  await productContract.addReview(22091, 60, "Útil", {from: consumer2});
  console.log(await productContract.get(22091, {from: consumer2}));
  
  await productContract.transfer(distributer, 22092, {from: manufacturer2});
  await productContract.addReview(22092, 40, "Demasiado caro", {from: distributer});
  await productContract.transfer(retailer2, 22092, {from: distributer});
  await productContract.addReview(22092, 90, "Sabroso", {from: retailer2});
  await productContract.transfer(consumer1, 22092, {from: retailer2});
  await productContract.addReview(22092, 60, "Útil", {from: consumer1});
  console.log(await productContract.get(22092, {from: consumer1}));
  
  console.log("Estadísticas: ");
  var count = await productContract.getProductsCount({from: consumer1});
  console.log("Productos: " + count.words[0]);
  count = await productContract.getTransactionsCount({from: consumer2});
  console.log("Transacciones: " + count.words[0]);
  count = await productContract.getReviewsCount({from: consumer2});
  console.log("Reseñas: " + count.words[0]);

  console.log(await mainContract.getRole(admin));
  console.log(await mainContract.getRole(farmer1));
  console.log(await mainContract.getRole(farmer2));
  console.log(await mainContract.getRole(manufacturer1));
  console.log(await mainContract.getRole(manufacturer2));
  console.log(await mainContract.getRole(distributer));
  console.log(await mainContract.getRole(retailer1));
  console.log(await mainContract.getRole(retailer2));
  console.log(await mainContract.getRole(consumer1));
  console.log(await mainContract.getRole(consumer2));

  callback();
}

