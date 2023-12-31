const express = require("express");
const cors = require("cors");
const fsPromises = require("fs/promises");
const path = require("path");
const productsJsonPath = path.resolve(__dirname, "./products.json");
const app = express();
const port = 5000;
const getProductsJsonPath = path.resolve(__dirname, "./products.json");

let currentLocale = "en";


const readJsonFile = async (filePath) => {
    const data = await fsPromises.readFile(filePath);
    return JSON.parse(data);
}

const getLocaleJsonPath = (lng) => {
    return path.resolve(__dirname, `./${lng}.json`);
}


app.use(cors({
    origin: "http://localhost:3000"
}));

app.get("/api/translations/:lng", (req, res) => {
    currentLocale = req.params.lng;
    readJsonFile(getLocaleJsonPath(currentLocale)).then(json => {
        res.json(json);
    });
});

app.get("/api/products/", (req, res) => {
    readJsonFile(getProductsJsonPath).then(json => {
        json.forEach(el => {
            const name = el.name[currentLocale];
            const description = el.description[currentLocale];
            el.name = name;
            el.description = description;
        });

        res.json(json);
    });
});

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
})