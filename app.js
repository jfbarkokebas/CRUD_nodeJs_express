const { response } = require('express');
const {randomUUID} = require('crypto')//gera um ID universal

const express = require('express');
const { request } = require('http')
const fs = require('fs') // node/file system

const app = express()

app.use(express.json())

/**
 * POST -> inserir um dado
 * GET ->  buscar um dado
 * PUT -> alterar um dado
 * DELETE -> deletar um dado
 */

/**
 * Body => sempre que eu quiser enviar dados para a minha aplicação
 * Params => /product/1244657646u6u
 * Query => /product?id=1246536t&value=346687758 
 *      (? = parametros de busca,  & = adicionar mais parametros)
 */

let products = []

fs.readFile('products.json', 'utf-8', (err, data)=>{
    if(err){
        console.log(err);
    }else{
        products = JSON.parse(data)
    }
})

app.post('/products', (request, response)=>{
    //nome e preço

    const {name, price} = request.body

    const product ={
        name,
        price,
        id: randomUUID()
    }

    products.push(product)
    
    /**
     * fs.writeFile(<nomeArquivoACriar>, JSON.stringfy(arrayInserido), error)
     */
   productFile()

    return response.json(product)
})

app.get('/products', (request, response)=>{
    return response.json(products)
})

//criando rotas:
app.get('/products/:id', (request, response)=>{
    const {id} = request.params
    
    const product = products.find(product => product.id === id)
    return response.json(product)
})

app.put('/products/:id', (request, response=>{

    const {id} = request.params
    const {name, price} = request.body

    const productIndex = products.findIndex(product=> product.id === id)
    //update
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }

    productFile()

    return response.json({message: "Produto alterado com sucesso!"})

}))

app.delete('/products/:id' , (request, response)=>{

    const {id} = request.params
    const productIndex = products.findIndex(product=> product.id === id)
    
    //removendo
    products.splice(productIndex,1)

    productFile()

    return response.json({message: 'Produto removido com sucesso!!'})

})

function productFile(){
    fs.writeFile("products.json", JSON.stringify(products), (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Produto inserido');
        }
    })
}

app.listen(3000, () => { console.log('Servidor rodando na porta 3000'); })

