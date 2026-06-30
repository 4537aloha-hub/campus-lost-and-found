import db from "../../db/index.js"

// 新增轮播图图片
export const addBannerHandler = async (req,res)=>{
    try{

        const {
            title,
            image_url,
            link_url,
            sort,
            status
        } = req.body

        if(!image_url){
            return res.cc('请上传轮播图')
        }

        const [result] = await db.query(
            `
            INSERT INTO banners
            (
                title,
                image_url,
                link_url,
                sort,
                status
            )
            VALUES(?,?,?,?,?)
            `,
            [
                title || null,
                image_url,
                link_url || null,
                sort || 0,
                status ?? 1
            ]
        )

        if(result.affectedRows!==1){
            return res.cc('新增失败')
        }

        res.cc('新增成功',0)

    }catch(err){
        res.cc(err)
    }

}
// 获取轮播图图片列表
export const getBannerListHandler = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT *
            FROM banners
            ORDER BY sort ASC,id ASC
        `)

        res.send({
            status:0,
            message:'获取轮播图成功',
            data:rows
        })

    }catch(err){
        res.cc(err)
    }
}
// 修改轮播图
export const updateBannerHandler = async (req,res)=>{

    try{

        const {id}=req.params

        const {
            title,
            image_url,
            link_url,
            sort,
            status
        }=req.body

        const [rows]=await db.query(
            `
            SELECT id
            FROM banners
            WHERE id=?
            `,
            [id]
        )

        if(rows.length!==1){
            return res.cc('轮播图不存在')
        }

        const [result]=await db.query(
            `
            UPDATE banners
            SET
                title=?,
                image_url=?,
                link_url=?,
                sort=?,
                status=?
            WHERE id=?
            `,
            [
                title,
                image_url,
                link_url,
                sort,
                status,
                id
            ]
        )

        if(result.affectedRows!==1){
            return res.cc('修改失败')
        }

        res.cc('修改成功',0)

    }catch(err){
        res.cc(err)
    }

}
// 删除轮播图
export const deleteBannerHandler = async (req,res)=>{

    try{

        const {id}=req.params

        const [rows]=await db.query(
            `
            SELECT id
            FROM banners
            WHERE id=?
            `,
            [id]
        )

        if(rows.length!==1){
            return res.cc('轮播图不存在')
        }

        const [result]=await db.query(
            `
            DELETE FROM banners
            WHERE id=?
            `,
            [id]
        )

        if(result.affectedRows!==1){
            return res.cc('删除失败')
        }

        res.cc('删除成功',0)

    }catch(err){
        res.cc(err)
    }

}
// 修改显示状态
export const updateBannerStatusHandler = async (req,res)=>{

    try{

        const {id}=req.params

        const {status}=req.body

        const [result]=await db.query(
            `
            UPDATE banners
            SET status=?
            WHERE id=?
            `,
            [
                status,
                id
            ]
        )

        if(result.affectedRows!==1){
            return res.cc('修改失败')
        }

        res.cc('修改成功',0)

    }catch(err){
        res.cc(err)
    }

}