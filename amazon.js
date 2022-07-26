require("chromedriver");
require("geckodriver");

let {By, Builder, Key, until, Capability} = require("selenium-webdriver");
const prompt = require("prompt-sync")({ sigint: true });

let browserstack_user = prompt("Enter username: ");
let browserstack_key = prompt("Enter access key: ");
let parallel_status = prompt("Run parallel configurations (yes or no): ");

var capability1 = {
    "os" : "Windows",
    "os_version" : "10",
    "browserName" : "Chrome",
    "browser_version" : "latest",
    "project" : "Bstack Demo test",
    "name" : "Bstack Demo test",
    "browserstack.local" : "false",
    "browserstack.networkLogs" : "true",
    "browserstack.selenium_version" : "4.2.2",
}

const capability2 = [
    {
        "os" : "Windows",
        "os_version" : "10",
        "browserName" : "Firefox",
        "browser_version" : "latest",
        "project" : "Bstack Demo test",
        "name" : "Bstack Demo test",
        "browserstack.local" : "false",
        "browserstack.networkLogs" : "true",
    },
    {
        "os" : "Windows",
        "os_version" : "10",
        "browserName" : "Chrome",
        "browser_version" : "latest",
        "project" : "Bstack Demo test",
        "name" : "Bstack Demo test",
        "browserstack.local" : "false",
        "browserstack.networkLogs" : "true",
        "browserstack.selenium_version" : "4.2.2",
    }
]
  

async function test(capability) {
    let driver = new Builder()
                     .usingServer(`https://${browserstack_user}:${browserstack_key}@hub.browserstack.com/wd/hub`)
                     .withCapabilities(capability)
                     .build();

    try {
        await driver.get("https://www.amazon.com/");

        await driver.findElement(By.xpath("//input[@id='twotabsearchtextbox']")).sendKeys("iPhone X");

        await driver.findElement(By.id("nav-search-submit-button")).click();
        
        await driver.findElement(By.xpath('//*[@id="search"]/span/div/h1/div/div[2]/div/div/form/span')).click();
        
        await driver.findElement({id : "s-result-sort-select_1"}).click();


        await driver.wait(until.elementLocated(By.id("p_n_feature_twenty_browse-bin/17881878011")));

        await driver.findElement(By.xpath('//*[@id="p_n_feature_twenty_browse-bin/17881878011"]/span/a/span')).click();

        let products = await driver.findElements(By.className("a-section a-spacing-small a-spacing-top-small"));

        let k = 0;

        for (let product of products) {
            if (k <= 1) {
                k += 1;
                continue;
            }

            let children = await product.findElements(By.xpath("./child::*"));
            let h2 = await children[0].findElement(By.xpath("./child::*"));
            let link = await h2.findElement(By.xpath("./child::*"));

            console.log("Name : ", await h2.getText());
            console.log("Link : ", await link.getAttribute("href"));

            var price = "";
            let rates = await children[2].findElements(By.className("a-offscreen"));

            for (rate of rates) {
                price = await rate.getAttribute('innerText');
                console.log("Price : ", price);
            }

            console.log("\n");
        }

    } catch(e) {
        console.log(e.message);
    }

    setTimeout(() => {
        driver.quit();
    }, 3000);
}

if (parallel_status === "no")
    test(capability1);
else {
    capability2.map((capability) => {
        test(capability)
    })
}