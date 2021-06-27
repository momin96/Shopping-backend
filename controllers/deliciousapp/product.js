// This product file is for different application named DeliciousApp which are non Firebase, it has nothing to to with this project, Kept here just of testing basic functionality.
exports.getAllProducts = (req, res) => {

    let getProducts = createProducts();
    setTimeout(() => {
        return res.status(200).json(getProducts);
    }, 1500)
}

exports.getProductById = (req, res) => {

    let productId = req.params.id;
    let getProducts = createProducts();

    let product = getProducts[productId]

    setTimeout(() => {
        if (product != null) {
            return res.status(200).json(product);
        } else {
            return res.status(404).json({
                error: "Queried product does not available"
            })
        }
    }, 1500);
}

exports.getProductByLocationId = (req, res) => {
    let productId = req.params.productId;
    let locationId = req.params.locationId

    let allProduct = createProducts();

    setTimeout(() => {
        for (let key in allProduct) {
            let product = allProduct[key]
            if (product.itemLocation) {
                if (product.itemLocation == locationId && key == productId) {
                    return res.status(200).json(product)
                }
            }
        }

        return res.status(404).json({
            error: "product does not exist on mentioned location"
        })
    }, 1000)
}


function createProducts() {

    let obj1 = {
        "itemCategory": "Fruits",
        "itemCode": "Bobs_DarkApple",
        "itemDescription": "Its very dark",
        "itemLocation": "customer99",
        "itemMisc": "Other infor",
        "itemName": "Dark Apple",
        "itemQuantity": 1,
        "itemThumbnailURL": "https://images-na.ssl-images-amazon.com/images/I/918YNa3bAaL._SX522_.jpg",
        "itemTotalAmount": 8,
        "itemUniqueId": "Bobs_DarkApple",
        "itemUnitPrice": 8
    }

    let obj2 = {
        "itemCategory": "Fruits",
        "itemCode": "app010203",
        "itemDescription": "Gala Apple, crunch and sweet deliciuos",
        "itemLocation": "localtionId1",
        "itemMisc": "other info for future",
        "itemName": "Apple",
        "itemQuantity": 1,
        "itemThumbnailURL": "https://images-na.ssl-images-amazon.com/images/I/918YNa3bAaL._SX522_.jpg",
        "itemTotalAmount": 13,
        "itemUniqueId": "itemUniqueId1",
        "itemUnitPrice": 13
    }

    let obj3 = {
        "itemCategory": "Drinks",
        "itemCode": "CokeCola_Zero_Pack_12",
        "itemDescription": "Its is banana",
        "itemLocation": "HBS1000",
        "itemMisc": "Other infor",
        "itemName": "Yellow Banana",
        "itemQuantity": 1,
        "itemThumbnailURL": "https://images-na.ssl-images-amazon.com/images/I/918YNa3bAaL._SX522_.jpg",
        "itemTotalAmount": 5.5,
        "itemUniqueId": "CokeCola_Zero_Pack_12",
        "itemUnitPrice": 5.5
    }

    let mainObject = {
        "Bobs_DarkApple": obj1,
        "app010203": obj2,
        "CokeCola_Zero_Pack_12": obj3
    }

    return mainObject
}