const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const year = ["2023", "2024", "2025"];

function handleThings(dbResult, inputs) {
    // store result arrary into temp
    let tempArray = [];
    if (dbResult) {
        // handle categories list same data enter twice
        inputs.things.forEach((inputRecord, index) => {
            // Check inputRecord.categorey is present on db record
            let isRecordExist = false;
            dbResult.things.forEach((dbRecord, dbIndex) => {
                if (inputRecord.categorey == dbRecord.categorey) {
                    isRecordExist = true;

                    // Check if categorey_value present or not
                    if (inputRecord.categorey_value) {
                        dbRecord.categorey_value += inputRecord.categorey_value;
                    } else {
                        // Handle when subcategories list available
                        inputRecord.subcategories.forEach((inputSubRecord, inputSubIndex) => {
                            // check input subcategoreis were match with db subcategories
                            let isSubCategoreyExist = false;
                            dbRecord.subcategories.forEach((dbSubRecord, dbSubIndex) => {
                                if (inputSubRecord.subcategorey == dbSubRecord.subcategorey) {
                                    isSubCategoreyExist = true;
                                    dbSubRecord.subcategorey_value += inputSubRecord.subcategorey_value;
                                }
                            });
                            if (!isSubCategoreyExist) {
                                dbRecord.subcategories.push(inputSubRecord);
                                if (!tempArray.some((val) => val.categorey == dbRecord.categorey)) {
                                    tempArray.push(dbRecord);
                                }
                            }
                        });
                    }
                }
            });
            if (!isRecordExist) {
                tempArray.push(inputRecord);
            }
        });

        inputs.things = tempArray;
        // clear the temp
        let additionalData = [];
        dbResult.things.forEach((data) => {
            if (!inputs.things.some((datum) => datum.categorey == data.categorey)) {
                additionalData.push(data);
            }
        });
        inputs.things = inputs.things.concat(additionalData);
    }
    return inputs;
}

function getWeek(month, y) {
    let setQueries = [];
    let days = new Date(year[y], month, 0).getDate();
    let month_temp = month;
    if (month_temp <= 9) month_temp = "0" + month_temp;

    for (let i = 0; i < days; i++) {
        let day = i + 1;
        if (day <= 9) day = "0" + day;
        day = `${year[y]}-${month_temp}-${day}`;
        let date = new Date(day.toString());
        if (((i + 1) == 1) || (date.getDay() == 0)) {
            setQueries.push({ startDate: day });
        }
        if (((i + 1) == days) || (date.getDay() == 6)) {
            setQueries[setQueries.length - 1]['endDate'] = day;
        }
        if ((new Date().getFullYear() == date.getFullYear()) &&
            (new Date().getMonth() == date.getMonth()) &&
            (new Date().getDate() == date.getDate())) {
            setQueries[setQueries.length - 1]['endDate'] = day;
            break;
        }
    }
    return setQueries;
}

function getMonth() {
    let setQueries = [];
    let year = "2023";
    let date = { startDate: null, endDate: null };
    for (let j = 0; j < month.length; j++) {
        let month_temp = j + 1;
        if (month_temp <= 9) month_temp = "0" + month_temp;
        let firstDay = "01";
        let month_current = new Date(year, month_temp, 0);
        let days = month_current.getDate();
        date.startDate = `${year}-${month_temp}-${firstDay}`;
        let today = new Date();
        if (today.getFullYear() == month_current.getFullYear() && today.getMonth() == month_current.getMonth()) {
            let day = today.getDate().toString();
            if (day.length == 1) day = "0" + day;
            date.endDate = `${year}-${month_temp}-${day}`
            setQueries.push({ ...date });
            date.startDate = date.endDate = null;
            break;
        }
        date.endDate = `${year}-${month_temp}-${days}`
        setQueries.push({ ...date });
        date.fromDate = date.endDate = null;
    }
    return setQueries;
}

function getYear() {
    let setQueries = [];
    let yr = year[0];
    // year.forEach(val => {
        let data = { startDate: null, endDate: null };
        data.startDate = `${yr}-01-${new Date(yr, '01', 1).getDate()}`;
        data.endDate = `${yr}-12-${new Date(yr, '12', 0).getDate()}`;
        setQueries.push({ ...data });
        data = { startDate: null, endDate: null };
    // });
    return setQueries;
}

function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

module.exports = { handleThings, getWeek, getMonth, getYear, formatDate };