const { reportModel, userModel, itemModel } = require('../models');

const getReportedUser = async (req, res) => {

    try {
        let report = await itemModel.findAll({
            include: {
                model: reportModel,
                include: userModel,
            },
        });

        const itemsReported = report.filter((item) => {
            if (item.Reports && item.Reports.length > 0) {
                return item;
            }
        });


        res.status(200).json(itemsReported);
    }
    catch (err) {
        console.log("Error in GeneralRoutes.readItems: ", err.message);
    }

}

module.exports = { getReportedUser };