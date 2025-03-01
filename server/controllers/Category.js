//import model
//Todo i need to write  createTag and showAllTags 

const Category = require("../models/Category");
const  createCategory = async (req, res) => {
    try{
        const { name, description } = req.body;
        if(!name || !description ){
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }
        const tag = await Tag.create({ name, description });
        return res.status(201).json({
            success: true,
            message: "Tag created successfully",
            tag,
        });
    }
    catch(e)
    {
              return res.status(500).json({
                success: false,
                message: e.message,
            });
    }
};

const showAllCategory = async (req, res) => {
    try{
        const category = await Category.find({}, { name: true, description: true });
        return res.status(200).json({
            success: true,
            message: "All tags fenched successfully",
            category,
        });
    }
    catch(e)
    {
              return res.status(500).json({
                success: false,
                message: e.message,
            });
    }
}
module.exports={
    createCategory,showAllCategory
}