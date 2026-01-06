import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Food from "./models/Food.js";

dotenv.config();

const foods = [
    {
        name: "Classic Cheeseburger",
        desc: "A juicy beef patty topped with melted cheddar, fresh lettuce, tomato, and our secret sauce on a toasted brioche bun.",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
        price: { org: 249, mrp: 299, off: 17 },
        category: ["Burgers", "Burger"],
        ingredients: ["Beef Patty", "Cheddar Cheese", "Lettuce", "Tomato", "Brioche Bun", "Secret Sauce"],
    },
    {
        name: "Spicy Pepperoni Pizza",
        desc: "Freshly baked thin-crust pizza loaded with spicy pepperoni, mozzarella, and chili flakes.",
        img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop",
        price: { org: 499, mrp: 599, off: 16 },
        category: ["Pizzas", "Pizza"],
        ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Pepperoni", "Chili Flakes"],
    },
    {
        name: "Hyderabadi Chicken Biryani",
        desc: "Authentic slow-cooked basmati rice and tender chicken, infused with saffron and aromatic spices.",
        img: "https://images.unsplash.com/photo-1563379091339-03b17af4a4f9?q=80&w=1000&auto=format&fit=crop",
        price: { org: 349, mrp: 450, off: 22 },
        category: ["Biriyanis"],
        ingredients: ["Basmati Rice", "Chicken", "Saffron", "Yogurt", "Onions", "Spices"],
    },
    {
        name: "Creamy Alfredo Pasta",
        desc: "Al dente fettuccine tossed in a rich and velvety parmesan cream sauce with a hint of garlic.",
        img: "https://images.unsplash.com/photo-1645112481338-356cda07504e?q=80&w=1000&auto=format&fit=crop", // Fallback spicy pepperoni if needed, using a generic pasta img instead
        img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000&auto=format&fit=crop",
        price: { org: 299, mrp: 349, off: 14 },
        category: ["Pasta"],
        ingredients: ["Fettuccine", "Heavy Cream", "Parmesan", "Garlic", "Butter"],
    },
    {
        name: "Chocolate Lava Cake",
        desc: "Warm and decadent chocolate cake with a molten lava center, served with a scoop of vanilla bean ice cream.",
        img: "https://images.unsplash.com/photo-1624353335566-68a33a8ed717?q=80&w=1000&auto=format&fit=crop",
        price: { org: 199, mrp: 249, off: 20 },
        category: ["Desserts", "Dessert"],
        ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla Ice Cream"],
    },
    {
        name: "Margarita Pizza",
        desc: "The classic – simple yet delicious with fresh basil, mozzarella di bufala, and extra virgin olive oil.",
        img: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?q=80&w=1000&auto=format&fit=crop",
        price: { org: 399, mrp: 449, off: 11 },
        category: ["Pizzas", "Pizza"],
        ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Mozzarella Buffalo", "Fresh Basil", "Olive Oil"],
    },
    {
        name: "Crispy Fried Chicken",
        desc: "Golden, crispy, and juicy fried chicken pieces served with a side of coleslaw and spicy mayo.",
        img: "https://images.unsplash.com/photo-1626645738196-c2a7c8d08f58?q=80&w=1000&auto=format&fit=crop",
        price: { org: 320, mrp: 380, off: 15 },
        category: ["Burgers"], // Categorized based on common app groupings
        ingredients: ["Chicken Wings/Thighs", "Buttermilk", "Flour", "Spices", "Coleslaw"],
    },
    {
        name: "Sushi Platter (12pcs)",
        desc: "A fresh assortment of California rolls, Spicy Tuna, and Salmon Nigiri, served with wasabi and ginger.",
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop",
        price: { org: 699, mrp: 899, off: 22 },
        category: ["Sushi"],
        ingredients: ["Sushi Rice", "Nori", "Fresh Salmon", "Tuna", "Cucumber", "Avocado"],
    },
    {
        name: "Blueberry Cheesecake",
        desc: "Rich New York style cheesecake topped with a sweet and tangy blueberry compote on a graham cracker crust.",
        img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
        price: { org: 249, mrp: 299, off: 16 },
        category: ["Desserts", "Dessert"],
        ingredients: ["Cream Cheese", "Graham Crackers", "Blueberries", "Sugar", "Vanilla"],
    },
    {
        name: "Iced Caramel Macchiato",
        desc: "Espresso combined with vanilla-flavored syrup, milk, and ice, topped with a drizzle of caramel.",
        img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1000&auto=format&fit=crop",
        price: { org: 149, mrp: 180, off: 17 },
        category: ["Beverages"],
        ingredients: ["Espresso", "Milk", "Caramel Sauce", "Vanilla Syrup", "Ice"],
    },
    {
        name: "Paneer Tikka Roll",
        desc: "Marinated cottage cheese cubes grilled to perfection and wrapped in a soft rumali roti with onions and mint chutney.",
        img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop",
        price: { org: 179, mrp: 220, off: 18 },
        category: ["Sandwiches"],
        ingredients: ["Paneer", "Rumali Roti", "Yogurt", "Mint Chutney", "Onion", "Capsicum"],
    },
    {
        name: "Chicken Hakka Noodles",
        desc: "Wok-tossed noodles with shredded chicken and crunchy vegetables in a light soy sauce.",
        img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop",
        price: { org: 229, mrp: 279, off: 17 },
        category: ["Noodles"],
        ingredients: ["Noodles", "Chicken", "Cabbage", "Carrot", "Soy Sauce", "Green Chili"],
    },
    {
        name: "Classic Caesar Salad",
        desc: "Crisp romaine lettuce, buttery croutons, and parmesan cheese tossed in a creamy Caesar dressing.",
        img: "https://images.unsplash.com/photo-1550304943-4bf63cd66228?q=80&w=1000&auto=format&fit=crop",
        price: { org: 189, mrp: 249, off: 24 },
        category: ["Salads"],
        ingredients: ["Romaine Lettuce", "Croutons", "Parmesan", "Caesar Dressing", "Lemon"],
    },
    {
        name: "Loaded Nachos",
        desc: "Crispy tortilla chips smothered in melted cheese, jalapenos, sour cream, and pico de gallo.",
        img: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=1000&auto=format&fit=crop",
        price: { org: 259, mrp: 320, off: 19 },
        category: ["Appetizers"],
        ingredients: ["Tortilla Chips", "Cheese Sauce", "Jalapenos", "Sour Cream", "Pico de Gallo"],
    },
    {
        name: "Strawberry Milkshake",
        desc: "Creamy and refreshing milkshake made with real strawberries and topped with whipped cream.",
        img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop",
        price: { org: 169, mrp: 210, off: 19 },
        category: ["Beverages"],
        ingredients: ["Strawberries", "Vanilla Ice Cream", "Milk", "Whipped Cream"],
    },
    {
        name: "Grilled Veggie Sandwich",
        desc: "Hearty whole-grain bread stuffed with grilled zucchini, bell peppers, pesto, and melted mozzarella.",
        img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1000&auto=format&fit=crop",
        price: { org: 149, mrp: 199, off: 25 },
        category: ["Sandwiches"],
        ingredients: ["Whole Grain Bread", "Zucchini", "Bell Peppers", "Pesto", "Mozzarella"],
    },
    {
        name: "BBQ Chicken Wings",
        desc: "Tender chicken wings coated in a smoky BBQ sauce, served with celery and ranch dip.",
        img: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=1000&auto=format&fit=crop",
        price: { org: 289, mrp: 350, off: 17 },
        category: ["Appetizers"],
        ingredients: ["Chicken Wings", "BBQ Sauce", "Celery", "Ranch Dressing"],
    },
    {
        name: "Mango Lassi",
        desc: "A traditional thick and creamy mango yogurt drink with a hint of cardamom.",
        img: "https://images.unsplash.com/photo-1546173159-315724a9f440?q=80&w=1000&auto=format&fit=crop",
        price: { org: 99, mrp: 129, off: 23 },
        category: ["Beverages"],
        ingredients: ["Mango Pulp", "Yogurt", "Sugar", "Milk", "Cardamom"],
    },
    {
        name: "Red Velvet Cupcake",
        desc: "Soft and velvety cocoa cake topped with a swirl of rich cream cheese frosting.",
        img: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000&auto=format&fit=crop",
        price: { org: 89, mrp: 120, off: 25 },
        category: ["Desserts", "Dessert"],
        ingredients: ["Cocoa Powder", "Cream Cheese", "Butter", "Flour", "Buttermilk"],
    },
    {
        name: "Fresh Fruit Bowl",
        desc: "A colorful medley of seasonal fruits including watermelon, grapes, apple, and kiwi.",
        img: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=1000&auto=format&fit=crop",
        price: { org: 159, mrp: 199, off: 20 },
        category: ["Salads"],
        ingredients: ["Watermelon", "Grapes", "Apple", "Kiwi", "Orange Juice"],
    }
];

const seedDB = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await Food.deleteMany({});
        console.log("Cleared existing food items.");

        // Insert new data
        await Food.insertMany(foods);
        console.log(`Seeded ${foods.length} premium food items.`);

        mongoose.connection.close();
        console.log("Seeding complete and connection closed.");
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
