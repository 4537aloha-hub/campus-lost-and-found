import db from "../../db/index.js"

// 获取分类和副分类数据
export const getCategoryTreeHandler = async (req, res) => {
    try {
        const [categories] = await db.query(
            'select * from categories order by id'
        )

        const [subCategories] = await db.query(
            'select * from sub_categories order by id'
        )

        const tree = categories.map(category => ({
            ...category,
            children: subCategories.filter(
                item => item.category_id === category.id
            )
        }))

        res.send({
            status: 0,
            message: '获取成功',
            data: tree
        })

    } catch(err) {
        res.cc(err)
    }
}

// 新增主分类
export const addCategoryHandler = async (req, res) => {
    try {
        const { name } = req.body

        if(!name){
            return res.cc('分类名称不能为空')
        }

        const [result] = await db.query(
            'insert into categories(name) values(?)',
            [name]
        )

        res.send({
            status:0,
            message:'新增成功'
        })

    } catch(err){
        res.cc(err)
    }
}

// 修改主分类
export const updateCategoryHandler = async (req,res)=>{
    try{

        const { id } = req.params
        const { name } = req.body

        const [result] = await db.query(
            'update categories set name=? where id=?',
            [name,id]
        )

        if(result.affectedRows !== 1){
            return res.cc('分类不存在')
        }

        res.send({
            status:0,
            message:'修改成功'
        })

    }catch(err){
        res.cc(err)
    }
}

// 删除主分类
export const deleteCategoryHandler = async (req,res)=>{
    try{

        const { id } = req.params

        await db.query(
            'delete from sub_categories where category_id=?',
            [id]
        )

        const [result] = await db.query(
            'delete from categories where id=?',
            [id]
        )

        if(result.affectedRows !== 1){
            return res.cc('分类不存在')
        }

        res.send({
            status:0,
            message:'删除成功'
        })

    }catch(err){
        res.cc(err)
    }
}

// 新增子分类
export const addSubCategoryHandler = async (req,res)=>{
    try{

        const {
            categoryId,
            name
        } = req.body

        const [result] = await db.query(
            `insert into sub_categories
            (category_id,name)
            values(?,?)`,
            [categoryId,name]
        )

        res.send({
            status:0,
            message:'新增成功'
        })

    }catch(err){
        res.cc(err)
    }
}

// 修改子分类
export const updateSubCategoryHandler = async (req,res)=>{
    try{

        const { id } = req.params
        const { name } = req.body

        const [result] = await db.query(
            'update sub_categories set name=? where id=?',
            [name,id]
        )

        if(result.affectedRows !== 1){
            return res.cc('副分类不存在')
        }

        res.send({
            status:0,
            message:'修改成功'
        })

    }catch(err){
        res.cc(err)
    }
}

// 删除子分类
export const deleteSubCategoryHandler = async (req,res)=>{
    try{

        const { id } = req.params

        const [result] = await db.query(
            'delete from sub_categories where id=?',
            [id]
        )

        if(result.affectedRows !== 1){
            return res.cc('副分类不存在')
        }

        res.send({
            status:0,
            message:'删除成功'
        })

    }catch(err){
        res.cc(err)
    }
}