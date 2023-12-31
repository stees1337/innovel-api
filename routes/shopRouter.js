import { Router } from "express";
import shopController from "../controllers/shopController.js"

const shopRouter = Router()

shopRouter.get("/getCategories", shopController.getAllCategories)
shopRouter.get("/isAuth", shopController.isAuth)
shopRouter.get("/getProducts", shopController.getAllProducts)
shopRouter.post("/addCategory", shopController.pushCategory)
shopRouter.post("/newUser", shopController.newUser)
shopRouter.post("/addProduct" , shopController.pushProduct)
shopRouter.post("/auth" , shopController.auth)
shopRouter.get("/getFavorite", shopController.getUserFavorite)
shopRouter.get("/getCart", shopController.getUserCart)
shopRouter.post("/addToCart" , shopController.pushCart)
shopRouter.post("/addToFavorite" , shopController.pushFavorite)
shopRouter.post("/deleteFromCart" , shopController.deleteCart)
shopRouter.post("/deleteFromFavorite" , shopController.deleteFromFavorite)
shopRouter.post("/deleteProduct" , shopController.deleteProduct)
shopRouter.post("/deleteCategory" , shopController.deleteCategory)
shopRouter.get("/getCartTotal" , shopController.cartTotal)
shopRouter.get("/logout" , shopController.logout)
shopRouter.post("/newOrder" , shopController.newOrder)
shopRouter.post("/newPartner" , shopController.newPartners)
shopRouter.post("/newNews" , shopController.newNews)
shopRouter.post("/editContact" , shopController.editContact)
shopRouter.get("/getOrders" , shopController.getAllOrders)
shopRouter.get("/getContacts" , shopController.getAllContacts)
shopRouter.get("/getNews" , shopController.getAllNews)
shopRouter.get("/getPartners" , shopController.getAllPartners)
shopRouter.post("/delPartners" , shopController.delPartners)
shopRouter.post("/delNews" , shopController.delNews)
shopRouter.post("/delOrder" , shopController.delOrder)
shopRouter.get("/getPopCategories" , shopController.getAllPopCategories)
shopRouter.post("/delPopCategories" , shopController.delPopCategory)
shopRouter.post("/newPopCategory" , shopController.newPopCategory)

export default shopRouter; 