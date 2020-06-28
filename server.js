const express = require("express")
const expressQraphql = require("express-graphql")
const {
    GraphQLSchema,
    GraphQLString,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')

const app = express()


const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
] 

const AuthorType = new GraphQLObjectType({
    name:'Author',
    description:'Author type defnition',
    fields: () =>({ 
        id: {
            type:GraphQLNonNull(GraphQLInt)
        },
        name:{ 
            type:GraphQLNonNull(GraphQLString)
        },
        books:{
            type:new GraphQLList(BookType),
            resolve:(author) => books.filter(book => book.authorId === author.id)
        }
    })
})

const BookType = new GraphQLObjectType({
    name :'Book',
    description:'Book type',
    fields: () =>({
        id: {
            type:GraphQLNonNull(GraphQLInt)
        },
        name:{ 
            type:GraphQLNonNull(GraphQLString)
        },
        authorId:{
            type:GraphQLNonNull(GraphQLInt)
        },
        author:{
            type:AuthorType,
            resolve: (book) =>  authors.find(e=> e.id === book.authorId)
        }


    })
})
const RootQuery = new GraphQLObjectType({
    name:'RootQuery',
    description:'Root query definition here.',
    fields: () =>({
        book:{
            type: (BookType),
            description : 'Single Book',
            args:{
                id:{ type:GraphQLInt}
            },
            resolve : (parent,args)=> books.find(book => book.id === args.id)

        },
        books:{
            type: new GraphQLList(BookType),
            description : 'List all books',
            resolve : ()=>books

        },
        author:{
            type: (AuthorType),
            description : 'Single Author',
            args:{
                id:{ type:GraphQLInt}
            },
            resolve : (parent,args)=> authors.find(author => author.id === args.id)

        },
        authors:{
            type: new GraphQLList(AuthorType),
            description : 'List all authors',
            resolve : ()=>authors

        }
    })
})

const RootQueryMutation = new GraphQLObjectType({
    name:'Mutation',
    description:'Insert element in array',
    fields:()=>
    ({
        addBook:{
            type:BookType,
            description:'Add book',
            args: {
                name:{type:GraphQLNonNull(GraphQLString)},
                authorId:{type:GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent,args)=>{
                const book = {id:books.length+1,name:args.name,authorId:args.authorId}
                books.push(book)
                return book
            }
        },
        addAuthor:{
            type:AuthorType,
            description:'Add Author',
            args: {
                name:{type:GraphQLNonNull(GraphQLString)}
            },
            resolve:(parent,args)=>{
                const author = {id:authors.length+1,name:args.name}
                authors.push(author)
                return author
            }
        }
        
    })
    
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation:RootQueryMutation,
})

app.use('/graphql',expressQraphql({
    schema:schema, 
    graphiql:true
}))
app.listen(5000,() => console.log('Server is running!!'))
 