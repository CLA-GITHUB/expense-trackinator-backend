var app = require('./app');
var port = 8080 || process.env.PORT;

app.listen(port, () => console.log(`Lisening on port ${port}`));
