import db from "../../db/index.js"

// 获取统计信息
export const getStatisticsHandler = async (req, res) => {
    try{
        // 1.用户统计

        // 今日新增用户
        const [todayUsers] = await db.query(`SELECT COUNT(*) AS today_count FROM users WHERE DATE(create_time) = CURDATE();`)

        // 昨日新增用户
        const [yesterdayUsers] = await db.query(`SELECT COUNT(*) AS yesterday_count FROM users WHERE DATE(create_time) = CURDATE() - INTERVAL 1 DAY;`)
        
        // 用户增长率
        const growth = yesterdayUsers === 0 ? 100 : ((todayUsers - yesterdayUsers) / yesterdayUsers * 100)

        // 2.物品统计

        // 今日新增物品
        const [todayItems] = await db.query(`SELECT COUNT(*) AS today_count FROM items WHERE DATE(created_at) = CURDATE();`)

        // 昨日新增物品
        const [yesterdayItems] = await db.query(`SELECT COUNT(*) AS yesterday_count FROM items WHERE DATE(created_at) = CURDATE() - INTERVAL 1 DAY;`)

        // 物品增长率
        const itemGrowth = yesterdayItems === 0 ? 100 : ((todayItems - yesterdayItems) / yesterdayItems * 100)

        // 3.已认领率

        // 物品总数
        const [totalItems] = await db.query(`SELECT COUNT(*) AS total_item FROM items`)

        // 已认领物品数
        const [claimed] = await db.query(`SELECT COUNT(*) AS claimed FROM items WHERE status = 'claimed';`)

        // 已认领率
        const claimedRate = claimed / totalItems * 100

        // 4.已审核率

        // 已审核物品数
        const [audited] = await db.query(`SELECT COUNT(*) AS audited FROM items WHERE audit_status = 1 OR status = 2;`)
        
        // 已审核率
        const auditedRate = audited / totalItems * 100

        res.send({
            status: 0,
            message: '获取统计信息成功',
            data: {
                todayUsers,
                yesterdayUsers,
                growth,
                todayItems,
                yesterdayItems,
                itemGrowth,
                claimed,
                claimedRate,
                audited,
                auditedRate,
            }
        })

    }catch(err) {
        res.cc('获取统计信息失败',err)
    }
}

// 统计7天数据信息 用于图表展示
export const get7DayStatisticsHandler = async (req, res) => {
    // 折线图数据 新增用户数趋势
    const [sevenDayUsersCount] = await db.query(`SELECT
    DATE(create_time) AS date,
    COUNT(*) AS count
    FROM users
    WHERE create_time >= CURDATE() - INTERVAL 7 DAY
    GROUP BY DATE(create_time)
    ORDER BY DATE(create_time);`)

    // 折线图数据 物品发布趋势
    const [sevenDayItemsCount] = await db.query(`SELECT
        DATE(created_at) AS date,
        COUNT(*) AS count
        FROM items
        WHERE created_at >= CURDATE() - INTERVAL 7 DAY
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at);`)

    function fillSevenDays(data) {
        const result = []

        for(let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)

            const dateStr = date.toISOString().split('T')[0]

            const item = data.find(
                row => row.date.toISOString().split('T')[0] === dateStr
            )

            result.push({
                date: dateStr.slice(5),
                count: item ? item.count : 0
            })
        }

        return result
    } 
    // 七天内补全数据
    const UserData = fillSevenDays(sevenDayUsersCount)
    const ItemData = fillSevenDays(sevenDayItemsCount)

    // 饼图 物品认领情况
    
    const [rows] = await db.query(`SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'claimed' THEN 1 ELSE 0 END) AS claimed
        FROM items
        `)
    
    const total = rows[0].total
    const claimed = rows[0].claimed || 0
    const unclaimed = total - claimed
    
    // 饼图 物品审核情况
    const [rows2] = await db.query(`SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN audit_status = 1 THEN 1 ELSE 0 END) AS audited
        FROM items
        `)
    
    const auditTotal = rows2[0].total
    const audited = rows2[0].audited || 0
    const unaudited = auditTotal - audited

    res.send({
        status: 0,
        message: '获取7天数据信息成功',
        data: {
            sevenDayUsersCount: UserData,
            sevenDayItemsCount: ItemData,
            claimed,
            unclaimed,
            audited,
            unaudited,
        }
    })
}
