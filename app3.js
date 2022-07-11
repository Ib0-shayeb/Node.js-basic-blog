const express = require('express');
//express app
//simillar server app using express
const app = express();
//register view engine
const morgan = require('morgan');
//db stuff 
const mongoose = require('mongoose');

const Blog = require('./models/blog');
const { render } = require('ejs');
//connect to mongo db
const dbURI = 'mongodb+srv://ibra_nodetut_blogwebapp:pkRZGH2pHA3WxY92@nodetuts.zmd7kcg.mongodb.net/nodetuts?retryWrites=true&w=majority';
mongoose.connect(dbURI,  { useNewUrlParser: true, useUnifiedTopology: true }); // pass  { useNewUrlParser: true, useUnifiedTopology: true } to eliminate deprication warning

app.set('view engine', 'ejs');
//if u want to put data in folder different than default:views use app.set('views', 'location');
//listen for requests
app.listen(3000);

//middleware & static files (images / css ...)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

app.post('/blogs', (req, res)=>{
    console.log(req.body);
    const blog = new Blog(req.body);//no need for individual passing of data as req body obj has same as blog obj
    blog.save()
    .then((result)=>{
        res.redirect('/');
    })
    .catch((err)=>{
        console.log(err);
    });
});

app.get('/add-blog', (req, res)=>{
    const blog = new Blog({
        title: 'new blog',
        snippet: 'about new blog',
        body: 'more about my new blog'
    });

    blog.save()
     .then((result)=>{
        res.send(result)
     })
     .catch((err)=>{
        console.log(err);
     });
});

app.get('/all-blogs', (req, res)=>{
    Blog.find()
    .then((resutlt)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/single-blog', (req, res) => {
    Blog.findById('5ea99b49b8531f40c0fde689')
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/' });
      })
      .catch(err => {
        console.log(err);
      });
  });

app.get('/', (req,res)=>{
    Blog.find().sort({createdAt: -1})
    .then((result)=>{
        res.render('index', {title: 'All Blogs', blogs: result})
    })
    .catch((err)=>{
        console.log(err);
    });
});
app.get('/about', (req,res)=>{
    res.render('about', {title: 'About'});
});
app.get('/blogs/create', (req,res)=>{
    res.render('create', {title: 'Create Blog'});
});
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });
//use is like else statement if no get catches then use does
//so it should be at the very botom
app.use((req, res)=>{
    //we have to specify status code
    res.status(404).render('404', {title: "404"});
}); 