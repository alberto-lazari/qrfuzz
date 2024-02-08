class Inspector {
  app_name = "postepay";
  app_package = "posteitaliane.posteapp.apppostepay";
  app_activity =
    "posteitaliane.posteapp.apppostepay.ui.activity.SplashActivity";

  async goToScan(driver) {
    let ok = await driver.findElement(
      "id",
      "posteitaliane.posteapp.apppostepay:id/second_bt",
    );
    await driver.elementClick(ok.ELEMENT);
    await driver.pause(1000);

    let scan = await driver.findElement(
      "id",
      "posteitaliane.posteapp.apppostepay:id/access_qr",
    );
    await driver.elementClick(scan.ELEMENT);
    await driver.pause(1000);

    let ok2 = await driver.findElement(
      "id",
      "posteitaliane.posteapp.apppostepay:id/customDrawMeButton",
    );
    await driver.elementClick(ok2.ELEMENT);
  }

  async getResultView(driver) {
    return await driver.findElement(
      "id",
      "posteitaliane.posteapp.apppostepay:id/md_titleFrame",
    );
  }

  async goBackToScan(driver) {
    let ok = await driver.findElement(
      "id",
      "posteitaliane.posteapp.apppostepay:id/md_buttonDefaultPositive",
    );
    await driver.elementClick(ok.ELEMENT);

    await driver.pause(1000);

    let ok2 = await driver.findElement(
      "id",
      "posteitaliane.posteapp.apppostepay:id/second_bt",
    );
    await driver.elementClick(ok2.ELEMENT);

    await driver.pause(1000);

    let scan = await driver.findElement(
      "id",
      "posteitaliane.posteapp.apppostepay:id/access_qr",
    );
    await driver.elementClick(scan.ELEMENT);
  }
}

exports.Inspector = Inspector;
