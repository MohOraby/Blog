var express = require("express"),
app = express(),
bodyparser = require("body-parser"),
mongoose = require("mongoose"),
methodoverride = require("method-override");

mongoose.connect("mongodb://localhost/Blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodoverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image : String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){    
    blog.find({}, function(err, blogs){
        if(err) {
            console.log("error");
        } else {
            res.render("blogs", {blogs: blogs});
        }
    });
});

app.post("/blogs", function(req, res){
    blog.create(req.body.blog, function(err, newblog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.get("/blogs/:id", function(req, res){
    blog.findById(req.params.id, function(err, foundblog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundblog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    blog.findById(req.params.id, function(err, foundblog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundblog});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/blogs/" + req.params.id);
        } else {
            res.redirect("/blogs/");
        }
    });
});

app.listen(5000, function(){
    console.log("Server is running");
});