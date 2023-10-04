import express from "express";
import axios from "axios";
import lodash from "lodash";
const router = express.Router();

router.use("/" , async(req , res , next)=>
{
    let response = undefined;
    try
    {
        response = await axios.get("https://intent-kit-16.hasura.app/api/rest/blogs" , 
        {
            headers : "x-hasura-admin-secret: 32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"
        });

    }
    catch(error)
    {
        console.log(error);
    }
    const data = response?.data?.blogs;
    req.data = data;
    next();
});

function getDetails(blogs)
{
    const length = lodash.size(blogs);
    const maxBlog = lodash.maxBy(blogs,obj => obj.title.length);
    const blogsWithPrivacy = lodash.filter(blogs , obj => lodash.includes(obj.title.toLowerCase() , 'privacy'));
    const uniqueBlogs = lodash.uniqBy(blogs , 'title');
    return {length , maxBlog , blogsWithPrivacy , uniqueBlogs};
}

function getQueryDetails(blogs , query)
{
    const s = query;
    const blogsWithQuery = lodash.filter(blogs , obj => lodash.includes(obj.title.toLowerCase() , 'privacy'));
    return blogsWithQuery;
}

router.get("/id",(req , res)=>
{
    const blogs = req.data;
    const memoizedGetDetails = lodash.memoize(getDetails);
    const {length , maxBlog , blogsWithPrivacy , uniqueBlogs} = memoizedGetDetails(blogs);

    return res.json({numberOfBlogs : length , maxBlog : maxBlog , blogsWithPrivacy : blogsWithPrivacy , uniqueBlogs : uniqueBlogs});
});

router.get("/blog-search" , (req , res)=>
{
    const blogs = req.data;
    const {query} = req.query;
    const memoizedGetDetails = lodash.memoize(getQueryDetails);
    const blogsWithQuery = memoizedGetDetails(blogs , query);
    return res.json({blogsWithQuery : blogsWithQuery})
})

export default router;
