import mongoose from "mongoose";
import config from "../data/config.js";
import Category from "./schemas/category.js";
import Product from "./schemas/product.js";
import User from "./schemas/user.js";
import Cart from "./schemas/cart.js"
import Favorite from "./schemas/favorite.js"
import Contacts from "./schemas/contacts.js";
import News from "./schemas/news.js";
import Partners from "./schemas/partners.js";
import Orders from "./schemas/orders.js";
import Popcategories from "./schemas/popcategories.js";

export function connect() {
    mongoose.connect(config.mongo_url, {
            useUnifiedTopology: true
            , user: config.mongo_login
            , pass: config.mongo_password
        })
        .then(() => {
            console.log("mongo connected")
        })
        .catch((e) => {
            console.log(e);
        })
}

export async function getCartById(cid) {
    const cart = await Cart.findOne({
            _id: cid
        }, function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return cart
    
}

export async function editContacts(type, content) {
    try {
        await Contacts.updateOne({
            type: type
        }, {
            content: content
        })
    } catch {
        return "error"
    }
}

export async function getContacts() {
    const contacts = await Contacts.find({}, function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return contacts
}

export async function getNews() {
    const contacts = await News.find({}, function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return contacts
}

export async function getPartners() {
    const contacts = await Partners.find({}, function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return contacts
}

export async function addOrder(buyerType, buyerName, buyerPhone, buyerLastName, buyerEmail, deliveryRegion, deliveryCity, deliveryCost, products, count) {
    
    const partners = new Orders({
        _id: new mongoose.Types.ObjectId()
        , buyerType: buyerType
        , buyerName: buyerName
        , buyerPhone: buyerPhone
        , buyerLastName: buyerLastName
        , buyerEmail: buyerEmail
        , deliveryRegion: deliveryRegion
        , deliveryCity: deliveryCity
        , deliveryCost: deliveryCost
        , products: products
        , count: count
    })
    
    try {
        await partners.save()
        return partners;
    } catch (error) {
        console.log(error)
        return null
    }
    
}


export async function getOrders() {
    const contacts = await Orders.find(function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return contacts
}

export async function getPopCategories() {
    const contacts = await Popcategories.find(function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return contacts
}

export async function addNews(content) {
    
    const news = new News({
        _id: new mongoose.Types.ObjectId()
        , content: content
    })
    
    try {
        await news.save()
    } catch {
        return null
    }
    
}

export async function deleteNews(nid) {
    try {
        await News.deleteOne({
            _id: nid
        })
    } catch {
        return null
    }
}

export async function addPopcategory(name, content) {
    
    const partners = new Popcategories({
        _id: new mongoose.Types.ObjectId()
        , name: name
        , content: content
    })
    
    try {
        await partners.save()
    } catch {
        return null
    }
    
}

export async function deletePopcategory(nid) {
    try {
        await Popcategories.deleteOne({
            _id: nid
        })
    } catch {
        return null
    }
}

export async function addPartners(name, content) {
    
    const partners = new Partners({
        _id: new mongoose.Types.ObjectId()
        , name: name
        , content: content
    })
    
    try {
        await partners.save()
    } catch {
        return null
    }
    
}

export async function deletePartners(nid) {
    try {
        await Partners.deleteOne({
            _id: nid
        })
    } catch {
        return null
    }
}

export async function deleteOrder(nid) {
    try {
        await Orders.deleteOne({
            _id: nid
        })
    } catch {
        return null
    }
}

export async function delProduct(pid) {
    
    try {
        await Product.deleteOne({
            _id: pid
        })
        await Cart.deleteMany({
            product: pid
        })
        await Favorite.deleteMany({
            product: pid
        })
    } catch {
        return "error"
    }
    
}

export async function delCategory(cid) {
    
    try {
        
        const prods = await getProducts()
        
        const catprods = prods.filter(obj => obj.category == cid)
        
        for (let prod of catprods) {
            await delProduct(prod._id)
        }
        
        await Category.deleteOne({
            _id: cid
        })
        
    } catch {
        return "error"
    }
    
}

export async function getCartCount(uid) {
    
    const cart = await getCart(uid);
    
    let sum = 0;
    
    for (const cobj of cart) {
        
        const product = await getProductById(cobj.product)
        
        sum += cobj.count * (Number(product.price) ? Number(product.price) : 0)
        
    }
    
    return {
        total: sum
    }
    
}

export async function addCart(pid, count, uid) {
    
    const available = await getCart(uid)
    
    const available2 = available.filter(obj => obj.product == pid)
    
    if (available2.length > 0) {
        try {
            await Cart.updateOne({
                    userId: uid
                    , product: pid
                }, {
                    $inc: {
                        count: count
                    }
                })
                .clone()
            
            available2[0].count += count
            
            return available2[0];
        } catch (error) {
            console.log(error)
            return null
        }
        
    }
    
    const cart = new Cart({
        _id: new mongoose.Types.ObjectId()
        , product: pid
        , count: count
        , userId: uid
        , count: count
    })
    
    try {
        await cart.save()
    } catch {
        return null
    }
    
    return cart
}

export async function deleteFromCart(cid, count) {
    
    const cartObj = await getCartById(cid)
    
    if (!cartObj || cartObj == "error") {
        return "error"
    }
    
    if (cartObj.count <= count) {
        await Cart.deleteOne({
            _id: cid
        })
        
        return {}
    }
    
    await Cart.updateOne({
        _id: cid
    }, {
        $inc: {
            count: -count
        }
    })
    
    cartObj.count -= count
    
    return cartObj
    
}

export async function getCart(uid) {
    const found = await Cart.find({
            userId: uid
        }, function (err, object) {
            if (err) {
                console.log(err)
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return found
}

export async function getProductById(id) {
    const found = await Product.findOne({
            _id: id
        }, function (err, object) {
            if (err) {
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    return found
}

export async function getFavorite(uid) {
    const found = await Favorite.find({
            _id: uid
        }, function (err, object) {
            if (err) {
                console.log(err)
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    return found
}

export async function getAllUserFavorite(uid) {
    const found = await Favorite.find({
            userId: uid
        }, function (err, object) {
            if (err) {
                console.log(err)
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    return found
}

export async function getCategories() {
    const found = await Category.find({}, function (err, object) {
            if (err) {
                console.log(err)
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    return found
}

export async function getProducts() {
    const found = await Product.find({}, function (err, object) {
            if (err) {
                console.log(err)
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    return found
}

export async function getUser(token) {
    const found = await User.findOne({
            token: token
        }, function (err, object) {
            if (err) {
                console.log(err)
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return found
}


export async function getUserById(id) {
    const found = await User.findOne({
            _id: id
        }, function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return found
}

export async function getUserByLogin(login) {
    const found = await User.findOne({
            login: login
        }, function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return found
}

export async function getCategoryById(id) {
    try {
        const found = await Category.find({
                _id: id
            }, function (err, object) {
                if (err) {
                    console.log(err)
                    return null
                } else if (object) {
                    return object
                } else {
                    return null
                }
            })
            .clone()
        
        return found
    } catch {
        if (id != "root") {
            return true
        } else {
            return null
        }
    }
    
}

export async function addProduct(name, category, photo, price, count, description) {
    const product = new Product({
        _id: new mongoose.Types.ObjectId()
        , name: name
        , category: category
        , photo: photo
        , price: price
        , count: count
        , description: description
    })
    
    try {
        await product.save()
    } catch {
        return null
    }
    
    return product
}

export async function registerUser(name, login, email, econfirmation, token, organization) {
    
    const user = new User({
        _id: new mongoose.Types.ObjectId()
        , name: name
        , login: login
        , email: email
        , econfirmation: econfirmation
        , token: token
        , organization: organization
        , admin: false
    })
    
    try {
        await user.save()
    } catch {
        return null
    }
    
    return user
    
}

export async function isUserAuthorized(cookies) {
    
    console.log(cookies)
    
    if (!cookies) {
        return null
    }
    
    if (!cookies.token) {
        return null
    }
    
    const found = await User.findOne({
            token: cookies.token
        }, function (err, object) {
            if (err) {
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return found
}

export async function addCategory(name, parent) {
    const category = new Category({
        _id: new mongoose.Types.ObjectId()
        , name: name
        , parent: parent
    })
    
    try {
        await category.save()
    } catch {
        return null
    }
    
    return category
    
}

export async function findFavoById(fid) {
    const found = await Favorite.findOne({
            _id: fid
        }, function (err, object) {
            if (err) {
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return found
}

export async function deleteFavorite(fid) {
    
    const favorite = await Favorite.deleteOne({
            _id: fid
        }, function (err, object) {
            if (err) {
                console.log(err)
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return favorite
    
}

export async function getFavoriteById(fid) {
    
    const cart = await Favorite.findOne({
            _id: fid
        }, function (err, object) {
            if (err) {
                console.log(err)
                return null
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    return cart
}

export async function addToFavorite(pid, uid) {
    
    const favorite = await Favorite.findOne({
            product: pid
            , userId: uid
        }, function (err, object) {
            if (err) {
                return "error"
            } else if (object) {
                return object
            } else {
                return null
            }
        })
        .clone()
    
    if (favorite == "error") {
        return "error"
    }
    
    if (favorite) {
        return "exists"
    }
    
    const favo = new Favorite({
        _id: new mongoose.Types.ObjectId()
        , product: pid
        , userId: uid
    })
    
    try {
        await favo.save()
        return favo
    } catch (error) {
        console.log(error)
        return "error"
    }
    
}
