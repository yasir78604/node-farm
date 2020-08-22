const fs = require('fs');
const http = require('http');
const url = require('url');
const { fips } = require('crypto');

/////////////////////////////////////////////
/// Files
// const fileIn = fs.readFileSync('./txt/read-this.txt','utf-8');

// const fileOut = `this is something about avocado: ${fileIn}\nCreated on ${new Date()}`;

// fs.writeFileSync('./txt/output.txt',fileOut);
// console.log('file is written');

// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     fs.readFile(`./txt/${data}.txt`,'utf-8', (err,data2) => {
//         console.log(data2);
//     })
// });

/////////////////////////////////////////////
/// Server

const replaceTemplate = (temp,product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%ID%}/g,product.id);


    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');

    return output;
}



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct =fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8'); 
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer((req, res) => {

    const {query , pathname} = url.parse(req.url,true)
    

    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content':'text/html'});
        
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join();
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);

        res.end(output)
    }else if(pathname === '/api'){
        res.writeHead(200,{
            'Content-type':'application/json'
        });
        res.end(data);
    }else if(pathname === `/product`){
        res.writeHead(200,{'Content':'text/html'})
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product)

        res.end(output);
    }else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'its header'
        });

        res.end('<h1>Page Not Found</h1>');
    }
    
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('Server is running');
});


