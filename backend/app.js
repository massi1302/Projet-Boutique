const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
app.use('/img', express.static(path.join(__dirname, 'img')));



const cors = require('cors');
app.use(cors({
    origin: "*"
}));

const jewelriesRouter = require("./routes/routes");
app.use( jewelriesRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/jewelry`);
});