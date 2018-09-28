const color = require('css-color-converter');

const url = `${URL}/button.spec.html`;


const styles = {
    colors: {
        "white": [255, 255, 255, 1]
    },
    gradients: {
        main: 'linear-gradient(to right bottom, rgb(177, 85, 186), rgb(105, 58, 145))'
    },
    sizes: {
        'small': 20,
        'medium': 30,
        'main': 40,
        'large': 60,
    }
}


Object.entries(browsers).forEach(([browserName, browser]) => {
    let button;

    const setAttribute = (sel, attr, value) => browser
        .executeScript(
            'document.querySelector(arguments[0]).setAttribute(arguments[1], arguments[2])',
            sel, attr, value
        );

    const getProperty = (sel, prop) => browser
        .executeScript(
            'return document.querySelector(arguments[0])[arguments[1]]',
            sel, prop
        );

    const setProperty = (sel, prop, value) => browser
        .executeScript(
            'return document.querySelector(arguments[0])[arguments[1]] = arguments[2]',
            sel, prop, value
        );

    describe(`<zen-button> - ${browserName}`, () => {
        describe('Setup:', () => {
            it('loads correctly', async() => {
                await browser.get(url);
                button = await browser.findElement(by.tagName('zen-button'));
                expect(button).toBeDefined();
            });
        });
        describe('Initial styling', async() => {
            // it('has correct text', async() => {
            //     // Content
            //     expect(await button.getText()).toEqual('Hello');
            // });
            it('has correct size', async () => {
                const box = await button.getRect();
                expect(box.height).toEqual(styles.sizes.main);
                expect(Math.floor(box.width)).toEqual(109);
            });
            it('has correct background-image (gradient)', async () => {
                expect(await button.getCssValue('background-image')).toEqual(styles.gradients.main);
            });
            it('has correct font-size', async () => {
                expect(await button.getCssValue('font-size')).toEqual("16px");
            });
            it('has correct color', async () => {
                expect(
                    color(await button.getCssValue('color')).toRgbaArray()
                ).toEqual(styles.colors.white);
            });
            it('has correct font-weight', async() => {
                expect(await button.getCssValue('font-weight')).toEqual('600');
            });
            it('has correct padding', async() => {
                expect(await button.getCssValue('padding-right')).toEqual('20px');
                expect(await button.getCssValue('padding-left')).toEqual('20px');
            });
            it('has correct border-top-left-radius', async() => {
                expect(await button.getCssValue('border-top-left-radius')).toEqual('4px');
            });
            it('has correct border', async () => {
                const border = await button.getCssValue('border-width');
                expect(border === '0px' || border === '').toBe(true);
            });
        })


        describe('PROPERTY: size', async() => {
            it('should change attribute on setAttribute', async() => {
                await setAttribute('zen-button', 'size', 'large');
                expect(await button.getAttribute('size')).toEqual('large');
            });

            Object.entries(styles.sizes).forEach(([size, value]) => {
                it(`should have ${size} height when height="${size}"`, async () => {
                    await setAttribute('zen-button', 'size', size);
                    expect(await button.getAttribute('size')).toEqual(size);
                    const rect = await button.getRect();
                    expect(rect.height).toEqual(value);
                });
            });
            it(`should bind size attribute to property`, async() => {
                await setAttribute('zen-button', 'size', 'small');
                expect(await getProperty('zen-button', 'size')).toBe('small');
            });
            it(`should bind size property to attribute`, async() => {
                // Reset
                await setProperty('zen-button', 'size', 'large');
                expect(await button.getAttribute('size')).toBe('large');
                // Reset
                await setProperty('zen-button', 'size', 'main');
            });
        });
    })
});
