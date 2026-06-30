import db from "../db/index.js"
// 获取首页轮播图图片列表(只获取status为1的 1：显示 0：隐藏)
export const getHomeBannerHandler = async (req,res)=>{

    try{

        const [rows]=await db.query(
            `
            SELECT
                id,
                title,
                image_url,
                link_url
            FROM banners
            WHERE status=1
            ORDER BY sort ASC,id ASC
            `
        )

        res.send({
            status:0,
            message:'获取首页轮播图成功',
            data:rows
        })

    }catch(err){
        res.cc(err)
    }

}