import {
    getCategories
    , addCategory
    , registerUser
    , isUserAuthorized
    , addProduct
    , getProducts
    , getUser
    , getCart
    , addCart
    , deleteFromCart
    , addToFavorite
    , deleteFavorite
    , getProductById
    , delProduct
    , getCategoryById
    , delCategory
    , getAllUserFavorite
    , getCartCount
    , editContacts
    , getNews
    , getContacts
    , getPartners
    , getOrders
    , deletePartners
    , deleteNews
    , addOrder
    , addNews
    , addPartners
    , deleteOrder
    , addPopcategory
    , deletePopcategory
    , getPopCategories
} from "../db/db.js";
import {
    authSchema
    , cartSchema
    , categoryShema
    , dcartSchema
    , dfavoSchema
    , favoSchema
    , fileShema
    , orderSchema
    , productShema
    , registerShema
} from "../data/datavalidator.js";
import crypto from "crypto"
import nodeMailer from 'nodemailer'
import webp from 'webp-converter'
import config from "../data/config.js";

webp.grant_permission();

const md5 = data => crypto.createHash('md5')
    .update(data)
    .digest("hex")

async function getAllCategories(req, res) {
    
    const categories = await getCategories();
    
    if (!categories || categories == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(categories);
    
}

const transporter = nodeMailer.createTransport({
    host: 'smtp.mail.ru'
    , port: 465
    , auth: {
        user: config.email_login
        , pass: config.email_password
    }
, });

async function newOrder(req, res) {
    
    const {
        buyerType
        , buyerName
        , buyerPhone
        , buyerLastName
        , buyerEmail
        , deliveryRegion
        , deliveryCity
        , deliveryCost
        , products
        , count
    } = req.body;
    
    const bodyErrors = await orderSchema.safeParseAsync(req.body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const p = await addOrder(buyerType, buyerName, buyerPhone, buyerLastName, buyerEmail, deliveryRegion, deliveryCity, deliveryCost, products, count)
    
    if (!p) {
        return res.sendStatus(500)
    }
    
    const productDetails = await Promise.all(
        products.map(async (productId) => {
            const product = await getProductById(productId);
            return product;
        })
    );
    
    const isInvalidProduct = productDetails.some((product) => product === null);
    
    if (isInvalidProduct) {
        return res.sendStatus(400);
    }
    
    for (let i = 0; i < productDetails.length; i++) {
        productDetails[i].count = count[i]
    }
    
    const productsList = productDetails.map((product) => {
        return `- Название: ${product.name}, Цена: ${product.price}, Количество: ${product.count}, `;
    });
    
    const productsInfo = productsList.join('\n')
    
    const emailContent = `
Детали заказа:
    - Покупатель
    - Тип покупателя: ${buyerType}
    - Имя: ${buyerName}
    - Телефон: ${buyerPhone}
    - Фамилия: ${buyerLastName}
    - Электронная почта: ${buyerEmail}
    - Доставка
    - Регион: ${deliveryRegion}
    - Город: ${deliveryCity}
    - Стоимость
    - Доставка: ${deliveryCost}
    - Товары:
        ${productsInfo}
    - Итого: ${deliveryCost + productDetails.reduce(
        (total, product) => total + parseInt(product.price ? Number(product.price) * product.count : 0),
        0
    )}
    `;
    
    const adminMailOptions = {
        to: config.admin_email
        , from: `"Innovel" <${config.email_login}>`
        , subject: 'Подтверждение заказа'
        , text: emailContent
    , };
    
    const userMailOptions = {
        to: buyerEmail
        , from: `"Innovel" <${config.email_login}>`
        , subject: 'Заказ'
        , text: "Здравствуйте!\nБлагодарим Вас за покупку у продавца ООО «Инновационная электроника и силовая фотоника».\nОжидайте, скоро с Вами свяжется наш менеджер."
    , }
    
    transporter.sendMail(adminMailOptions, (error) => {
        if (error) {
            console.log(error)
            return res.sendStatus(500);
        } else {
            return res.sendStatus(200);
        }
    });
    
    transporter.sendMail(userMailOptions, (error) => {
        if (error) {
            console.log(error)
        }
    });
    
}

async function getAllProducts(req, res) {
    
    const products = await getProducts();
    
    if (!products || products == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(products);
    
}

async function auth(req, res) {
    
    const body = req.body
    const bodyErrors = await authSchema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const login = body.login
    
    const password = md5(body.password)
    
    const token = md5(login + password)
    
    const user = await getUser(token);
    
    if (!user) {
        return res.status(400)
            .json({
                error: "Invalid username or password"
            })
    }
    
    if (user == "error") {
        return res.sendStatus(500)
    }
    
    res.cookie('token', token)
        .status(200)
        .json(user);
    
}

async function isAuth(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user) {
        return res.sendStatus(401)
    }
    
    if (user == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(user)
    
}

async function getUserFavorite(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user) {
        return res.sendStatus(401)
    }
    
    if (user == "error") {
        return res.sendStatus(500)
    }
    
    const cart = await getAllUserFavorite(user._id)
    
    if (!cart || cart == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(cart)
    
}

async function getUserCart(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user) {
        return res.sendStatus(401)
    }
    
    if (user == "error") {
        return res.sendStatus(500)
    }
    
    const cart = await getCart(user._id)
    
    if (!cart || cart == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(cart)
    
}

async function pushCategory(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    const bodyErrors = await categoryShema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const newCategory = await addCategory(body.name, body.parent);
    
    if (!newCategory) {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .send(newCategory);
    
}

async function deleteProduct(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    
    if (!await getProductById(body.product)) {
        return res.status(401)
            .send("Invalid product id")
    }
    
    const product = await delProduct(body.product);
    
    if (product == "error") {
        return res.status(500)
            .send("error")
    }
    
    res.status(200)
        .json(product)
    
}

async function deleteCategory(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    
    if (!await getCategoryById(body.category)) {
        return res.status(401)
            .send("Invalid category id")
    }
    
    const category = await delCategory(body.category);
    
    if (category == "error") {
        return res.status(500)
            .send("error")
    }
    
    res.status(200)
        .json(category)
    
    
}

async function newUser(req, res) {
    
    const body = req.body
    const bodyErrors = await registerShema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const login = body.login
    
    const password = md5(body.password)
    
    const token = md5(login + password)
    
    res.cookie('token', token);
    
    const newUser = await registerUser(body.name, login, body.email, true, token, body.organization)
    
    if (!newUser) {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(newUser)
    
}

async function pushProduct(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const files = req.files
    const fileErrors = fileShema.safeParse(files);
    
    const body = req.body
    const bodyErrors = await productShema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    if (!fileErrors.success) {
        return res.status(400)
            .json({
                errors: fileErrors.error.errors
            })
    }
    
    const photo = Buffer.from(files.photo.data.buffer)
        .toString('base64');
    
    const photo_name = files.photo.name.split(".")
    
    const webp_photo = await webp.str2webpstr(photo, photo_name[photo_name.length - 1], "-q 80");
    
    const newProduct = await addProduct(body.name, body.category, webp_photo, body.price, body.count, body.description)
    
    if (!newProduct) {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(newProduct)
    
}

async function pushCart(req, res) {
    
    const body = req.body
    
    const bodyErrors = await cartSchema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const newcart = await addCart(body.product, body.count, body.userId)
    
    res.status(200)
        .json(newcart)
    
}

async function pushFavorite(req, res) {
    
    const body = req.body
    
    const bodyErrors = await favoSchema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const favo = await addToFavorite(body.product, body.userId)
    
    if (favo == "exists") {
        return res.status(400)
            .json({
                error: "already exists"
            })
    }
    
    if (favo == "error") {
        return res.sendStatus(500)
    }
    
    return res.status(200)
        .json(favo)
    
}

async function deleteCart(req, res) {
    
    const body = req.body
    
    const bodyErrors = await dcartSchema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const delCart = await deleteFromCart(body.cartId, body.count)
    
    if (delCart == "error" || !delCart) {
        res.sendStatus(500)
    }
    
    res.status(200)
        .send(delCart)
    
}

async function logout(req, res) {
    
    try {
        res.clearCookie('token')
    } catch {
        return res.status(500)
    }
    
    res.status(200)
        .send("OK")
    
}

async function cartTotal(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user) {
        return res.sendStatus(401)
    }
    
    if (user == "error") {
        return res.sendStatus(500)
    }
    
    const total = await getCartCount(user._id);
    
    res.status(200)
        .json(total)
    
    
}

async function deleteFromFavorite(req, res) {
    
    const body = req.body
    
    const bodyErrors = await dfavoSchema.safeParseAsync(body)
    
    if (!bodyErrors.success) {
        return res.status(400)
            .json({
                errors: bodyErrors.error.errors
            })
    }
    
    const deletedF = await deleteFavorite(body.favoriteId)
    
    if (!deletedF || deletedF == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(deletedF)
    
}

async function editContact(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    
    if (!body.type || !body.content) {
        return res.sendStatus(400)
    }
    
    const response = await editContacts(body.type, body.content)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
    
}


async function getAllOrders(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const products = await getOrders();
    
    if (!products || products == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(products);
    
}

async function getAllNews(req, res) {
    
    const products = await getNews();
    
    if (!products || products == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(products);
    
}


async function getAllContacts(req, res) {
    
    const products = await getContacts();
    
    if (!products || products == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(products);
    
}


async function getAllPartners(req, res) {
    
    const products = await getPartners();
    
    if (!products || products == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(products);
    
}

async function delPartners(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    
    if (!body.partner) {
        return res.sendStatus(400)
    }
    
    const response = await deletePartners(body.partner)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
    
}

async function delOrder(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    
    if (!body.order) {
        return res.sendStatus(400)
    }
    
    const response = await deleteOrder(body.order)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
    
}

async function delNews(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    
    if (!body.news) {
        return res.sendStatus(400)
    }
    
    const response = await deleteNews(body.news)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
    
}

async function newNews(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const files = req.files
    
    if (!files.content) {
        return res.sendStatus(400)
    }
    
    const photo = Buffer.from(files.content.data.buffer)
        .toString('base64');
    
    const photo_name = files.content.name.split(".")
    
    const webp_photo = await webp.str2webpstr(photo, photo_name[photo_name.length - 1], "-q 20");
    
    const response = await addNews(webp_photo)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
}

async function newPartners(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    const files = req.files
    
    if (!files.content) {
        return res.sendStatus(400)
    }
    
    if (!body.name) {
        return res.sendStatus(400)
    }
    
    console.log(files.content)
    
    const photo = Buffer.from(files.content.data.buffer)
        .toString('base64');
    
    const photo_name = files.content.name.split(".")
    
    const webp_photo = await webp.str2webpstr(photo, photo_name[photo_name.length - 1], "-q 80");
    
    const response = await addPartners(body.name, webp_photo)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
}

async function newPopCategory(req, res) {
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    const files = req.files
    
    if (!files.content) {
        return res.sendStatus(400)
    }
    
    if (!body.name) {
        return res.sendStatus(400)
    }
    
    console.log(files.content)
    
    const photo = Buffer.from(files.content.data.buffer)
        .toString('base64');
    
    const photo_name = files.content.name.split(".")
    
    const webp_photo = await webp.str2webpstr(photo, photo_name[photo_name.length - 1], "-q 80");
    
    const response = await addPopcategory(body.name, webp_photo)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
}

async function delPopCategory(req, res) {
    
    
    
    const user = await isUserAuthorized(req.cookies)
    
    if (!user || !user.admin) {
        return res.sendStatus(403)
    }
    
    const body = req.body
    
    if (!body.category) {
        return res.sendStatus(400)
    }
    
    const response = await deletePopcategory(body.category)
    
    if (response == "error") {
        return res.sendStatus(500)
    }
    
    res.sendStatus(200)
    
}

async function getAllPopCategories(req, res) {
    
    const products = await getPopCategories();
    
    if (!products || products == "error") {
        return res.sendStatus(500)
    }
    
    res.status(200)
        .json(products);
    
}

export default {
    getAllCategories
    , getAllProducts
    , isAuth
    , pushCategory
    , newUser
    , pushProduct
    , auth
    , getUserCart
    , getUserFavorite
    , pushCart
    , deleteCart
    , pushFavorite
    , deleteFromFavorite
    , deleteCategory
    , deleteProduct
    , logout
    , cartTotal
    , newOrder
    , newPartners
    , newNews
    , editContact
    , getAllOrders
    , getAllContacts
    , getAllNews
    , getAllPartners
    , delPartners
    , delNews
    , delOrder
    , newPopCategory
    , getAllPopCategories
    , delPopCategory
}
