
const mysql = require('mysql2/promise');
const getConnection = require('../config/conn');

// Function: getLoginSchools
async function getLoginSchools(req, res) {

    let conn;

    try {

        const {
            dbname,
            usname,
            std_username,
            std_password
        } = req.body;

        if (!dbname || !usname ||
            !std_username || !std_password) {

            return res.json({
                status: false,
                message: 'Required fields are missing'
            });
        }

         // Fur connection-ka database-ka
        conn = await getConnection();

        const query = `
            SELECT
                u.u_id,
                u.ID AS ID,
                IFNULL(
                    user_full_nameApp(p.name, ?, ?),
                    'End'
                ) AS name,
                u.username,
                u.password,
                u.email,
                u.lock_user,
                u.state,
                u.deleted,
                p.name AS privelege_name
            FROM users u,
                 user_branch ub,
                 user_privelege up,
                 privelege p,
                 li_privelege li,
                 sub_privelege sb
            WHERE
                u.u_id = ub.u_id
                AND ub.u_br_id = up.u_br_id
                AND p.pr_id = li.pr_id
                AND sb.li_pr_id = li.li_pr_id
                AND sb.sp_id = up.sp_id
                AND u.username = ?
                AND u.password = ?
        `;

        const [result] = await conn.execute(query, [
            std_username,
            std_password,
            std_username,
            std_password
        ]);

        if (result.length === 0) {
            return res.json({
                status: false,
                message: 'Invalid username or password'
            });
        }

        return res.json({
            status: true,
            message: result
        });

    } catch (error) {

        return res.json({
            status: false,
            message: error.message
        });

    } finally {

        // Xir connection-ka marka shaqadu dhammaato
        if (conn) {
            await conn.end();
        }

    }
}


// Function: showInstructions
function showInstructions(req, res) {

    return res.json({
        status: true,
        message: 'API is running successfully'
    });

}

async function getSchools(req, res){
    const { dbname, usname } = req.body;

    // if (!dbname) {
    //     return res.json({
    //         status: false,
    //         message: 'Required fields are missing'
    //     });
    // }

     // Fur connection-ka database-ka
    conn = await getConnection();

    const $query=`SELECT sc.id, sc.image,sc.name,sc.Default_language,sc.school_description,st.type school_type,sc.Database_name,en.user_name,en.password,en.Endpoint,sc.Status,sc.State,sc.instituationType, 
    pr.pr_image,pr.private_name,pr.private_description,pr.private_Datbase_name FROM schools sc, school_type st, privates pr, 
    EndPoint en WHERE sc.type=st.sct_id and sc.private_id=pr.pr_id and sc.end_point_no=en.end_point_no and sc.State='Active' and sc.id!=254 ORDER BY name ASC`;

    const [result] = await conn.execute($query);

    return res.json({
        status: true,
        message: result
    });

}


async function getEndPoints(req, res){
    const { dbname, usname } = req.body;

    // if (!dbname) {
    //     return res.json({
    //         status: false,
    //         message: 'Required fields are missing'
    //     });
    // }

     // Fur connection-ka database-ka
    conn = await getConnection();

    const $query=`SELECT * FROM EndPoint`;

    const [result] = await conn.execute($query);

    return res.json({
        status: true,
        message: result
    });

}

// All functions exported here
module.exports = {
    getLoginSchools,
    getSchools,
    getEndPoints,
    showInstructions
};
