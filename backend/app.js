const express = require('express');
const app = express();
const port = 3000;



const cors = require('cors');
app.use(cors({
    origin: "*"
}));

const sneakersRouter = require("./routes/routes");
app.use( sneakersRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});