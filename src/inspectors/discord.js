const credentials = require("./credentials");

class Inspector {
    app_name = "discord";
    app_package = "com.discord";
    app_activity = "com.discord.app.AppActivity$Main";

    async goToScan(driver) {
        const loginPath = '//android.widget.Button[@resource-id="com.discord:id/auth_landing_login"]';
        const isLogin = await driver.$(loginPath).isDisplayed();
        if(isLogin){
            const login = await driver.$(loginPath);
            await login.click();

            const auth = credentials('discord')

            const inputField = await driver.$('//android.widget.EditText[@resource-id="com.discord:id/phone_or_email_main_input"]');
            await inputField.setValue(auth.username);
    
            const pwField = await driver.$('//android.widget.EditText[@text="Password"]');
            await pwField.setValue(auth.password);
    
            const submitLogin = await driver.$('//android.widget.Button[@resource-id="com.discord:id/auth_login"]');
            await submitLogin.click();
        }

        const noThanksPath = '//android.widget.Button[@resource-id="com.discord:id/discord_hub_email_no"]'
        const isNoThanks = await driver.$(noThanksPath).isDisplayed();
        if(isNoThanks){
            const noThanks = await driver.$(noThanksPath);
            noThanks.click();
        }

        let tab = await driver.$('//android.widget.ImageView[@resource-id="com.discord:id/avatar"]');
        await tab.click();

        await driver.touchAction([
            { action: 'longPress', x: 136, y: 423 },
            { action: 'moveTo', x: 140, y: 228 },
            'release'
        ]);

        let qr = await driver.$('//android.widget.TextView[@resource-id="com.discord:id/qr_scanner"]');
        await qr.click();
    }

    async getResultView(driver) {
    	return await driver.$('//android.widget.TextView[@resource-id="com.discord:id/qr_scanner"]');
    }
    
    async goBackToScan(driver) {
    	let qr = await driver.$('//android.widget.TextView[@resource-id="com.discord:id/qr_scanner"]');
        await qr.click();
    }

}

exports.Inspector = Inspector;
