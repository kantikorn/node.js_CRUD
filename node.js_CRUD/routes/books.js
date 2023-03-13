let express = require('express')
let rounter = express.Router();
let dbCon = require('../lib/db');


//display books page
rounter.get('/', (req , res, next) => {
    dbCon.query('SELECT * FROM books ORDER BY id asc',(err , rows) => {
        if(err){
            req.flash('error' , err);
            res.render('books' , { data: ''});
        }  else {
            res.render('books' , { data: rows});
        }
    })
})

//display addbook page
rounter.get('/add' ,(req , res , next) => {
    res.render('books/add' , {
        name: '',
        author: ''
    })
})


rounter.post('/add', (req , res , next) =>{
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if (name.length === 0 || author.length === 0) {
            errors = true;
            //set flash message error ตั้งเออเร่อ ไห้เด้งข้อความ 
            req.flash('error', 'Plese enter name and author !!');

            // render to add.ejs ไห้ทำการเรนเดอร์หน้า books/add คือ หน้า add.ejs;
            res.render('books/add' , {
                name: name,
                author: author
            })
    } 

    //ถ้าเกิดไม่มี errors จะสร้าตัวเเปร form_data มาเก็บค่า
    if(!errors){
        //ตัวเเปร Form_data เก็บค่าเป็น Object
        let form_data = {
            name: name,
            author: author
        }

        //  insert data   ไปที่ฐานข้อมุล
        dbCon.query('INSERT INTO books SET ?' , form_data , (err, result) =>{
            if(err) {
                req.flash('error' , err)
                res.render('books/add' , {
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success' , 'books successfully  added');
                res.redirect('/books');
            }
        })

    }
})

//Display edit books page

//get data เพื่อทำการเเก้ไขข้อมูลจากไอดีเดิม
rounter.get('/edit/(:id)' , (req , res , next) => {
        let id = req.params.id; // สร้างตัวเเปรมาเก็บไอดี เพื่อทำการอัปเดต


        //ดึงข้อมูลตัวเก่ามาเเสดง จากการ get 
        dbCon.query('SELECT * FROM books WHERE id = ' + id, (err , rows , fields) => {
            if (rows.length <= 0){
                req.flash('error' , 'Book not found with id = ' + id)
                res.redirect('/books');
            } else {
                res.render('books/edit' ,{
                    title: 'Edit Book',
                    id: rows[0].id,
                    name: rows[0].name,
                    author: rows[0].author
                })
            }
        })
})


// Display Update book page

rounter.post('/update/:id' , (req , res , next) => {
    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if(name.length === 0 || author.length === 0) {
        errors = true;
        req.flash('error' , 'Plase Enter name and author');
        res.render('books/edit' , {
            id: req.params.id,
            name: name,
            author: author
        })
    } 

    //if No error ถ้าไม่มีเออเร่อ
    if (!errors) {
        let form_data = {
            name: name,
            author: author
        }
    //Query  Upadate Data Into Database
    dbCon.query("UPDATE books SET ? WHERE id = " + id, form_data ,(err , result) => {
            if(err){
                req.flash('error' , err)
                res.render('books/edit' , {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author
                })
            } else {
                req.flash('success' , 'Updated succesfully');
                res.redirect('/books')
            }
        })

    }
})


//Delete Book 

rounter.get('/delete/(:id)' , (req , res , next) => {
    let id = req.params.id;

    dbCon.query("DELETE FROM books WHERE id = " + id ,(err , result)=> {
        if (err){
            req.flash('error' , err)
            res.redirect('/books');
        } else {
            req.flash('success' , 'Books Deleted Successfully ! ID ' + id);
            res.redirect('/books');
        }
    })
})
module.exports = rounter;