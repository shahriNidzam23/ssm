

const companies = async (type, ssmid) => {
    const { chromium } = require('playwright');
    const browser = await chromium.launch({
        headless: true
    })
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation();
    await page.goto('https://www.ssm.com.my/Pages/e-Search.aspx')

    await page.setViewportSize({ width: 935, height: 789 })

    await page.waitForSelector('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_idDropRegistrationType')
    await page.click('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_idDropRegistrationType')

    await page.selectOption('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_idDropRegistrationType', type)

    await navigationPromise
    await page.waitForSelector('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_txtCarieSearch');
    await page.type('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_txtCarieSearch', ssmid)
    await page.waitForSelector('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_idBtneSearch');
    await page.$eval('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_idBtneSearch', async (el) => {
        el.disabled = false;
    });
    await page.waitForSelector('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_idBtneSearch');
    await page.click('#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_idBtneSearch')
    await navigationPromise
    let gridView = "";
    switch (type) {
        case "robNew":
        case "rob":
            gridView = "GridViewRob";
            break;
        case "rocNew":
        case "roc":
            gridView = "GridViewRoc";
            break;
        default:
            throw "Company/Business Registration Type not valid";
    }
    await page.waitForSelector(`#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_${gridView}`);
    let companies = [];
    try {
        companies = await page.$$eval(`#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_${gridView}`, async (el) => {
            return el.map(company => {
                const registration_number = company.querySelector('td:nth-child(1)');
                const new_registration_number = company.querySelector('td:nth-child(2)');
                const entity_type = company.querySelector('td:nth-child(3)');
                const status = company.querySelector('td:nth-child(4)');
                const gst_number = company.querySelector('td:nth-child(5)');
                return {
                    registration_number: registration_number.textContent.trim(),
                    new_registration_number: new_registration_number.textContent.trim(),
                    entity_type: entity_type.textContent.trim(),
                    status: status.textContent.trim(),
                    gst_number: gst_number.textContent.trim()
                };
            });

        });
        await page.waitForSelector(`#ctl00_ctl36_g_2e791db6_58e3_41f2_a6f4_9c226eefabbc_ctl00_${gridView}`);

    } catch (e) {
        return [];
    }
    await browser.close()
    return companies;
};

const types = () => {
    return [
        {
            name: "Company Registration Number Old",
            key: "roc"
        },
        {
            name: "Business Registration Number Old",
            key: "rob"
        },
        {
            name: "Company Registration Number New",
            key: "rocNew"
        },
        {
            name: "Business Registration Number New",
            key: "robNew"
        },
        {
            name: "LLP Registration Number",
            key: "llp"
        }
    ];
}

const test = () => {
    return "test";
}

module.exports = {
    companies,
    test,
    types
}