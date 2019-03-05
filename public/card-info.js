/*
 * card-info v1.2.4
 * Get bank logo, colors, brand and etc. by card number
 * https://github.com/iserdmi/card-info.git
 * by Sergey Dmitriev (http://srdm.io)
 */

;(function () {
    function CardInfo(numberSource, options) {
        CardInfo._assign(this, CardInfo._defaultProps);

        this.options = CardInfo._assign({}, CardInfo.defaultOptions, options || {});
        this.numberSource = arguments.length ? numberSource : '';
        this.number = CardInfo._getNumber(this.numberSource);

        this.backgroundGradient = CardInfo._getGradient(this.backgroundColors, this.options.gradientDegrees);

        const brandData = CardInfo._getBrand(this.number);
        if (brandData) {
            this.brandAlias = brandData.alias;
            this.brandName = brandData.name;
            const brandLogoBasename = CardInfo._getBrandLogoBasename(this.brandAlias, this.options.brandLogoPolicy, this.backgroundLightness, this.bankLogoStyle);
            this.brandLogoPng = CardInfo._getLogo(this.options.brandsLogosPath, brandLogoBasename, 'png');
            this.brandLogoSvg = CardInfo._getLogo(this.options.brandsLogosPath, brandLogoBasename, 'svg');
            this.brandLogo = CardInfo._getLogoByPreferredExt(this.brandLogoPng, this.brandLogoSvg, this.options.preferredExt);
            this.codeName = brandData.codeName;
            this.codeLength = brandData.codeLength;
            this.numberLengths = brandData.lengths;
            this.numberGaps = brandData.gaps
        }

        this.numberBlocks = CardInfo._getBlocks(this.numberGaps, this.numberLengths);
        this.numberMask = CardInfo._getMask(this.options.maskDigitSymbol, this.options.maskDelimiterSymbol, this.numberBlocks);
        this.numberNice = CardInfo._getNumberNice(this.number, this.numberGaps)
    }

    CardInfo._defaultProps = {
        bankAlias: null,
        bankName: null,
        bankNameEn: null,
        bankCountry: null,
        bankUrl: null,
        bankLogo: null,
        bankLogoPng: null,
        bankLogoSvg: null,
        bankLogoStyle: null,
        backgroundColor: '#eeeeee',
        backgroundColors: ['#eeeeee', '#dddddd'],
        backgroundLightness: 'light',
        backgroundGradient: null,
        textColor: '#000',
        brandAlias: null,
        brandName: null,
        brandLogo: null,
        brandLogoPng: null,
        brandLogoSvg: null,
        codeName: null,
        codeLength: null,
        numberMask: null,
        numberGaps: [4, 8, 12],
        numberBlocks: null,
        numberLengths: [12, 13, 14, 15, 16, 17, 18, 19],
        numberNice: null,
        number: null,
        numberSource: null,
        options: {}
    };

    CardInfo.defaultOptions = {
        brandsLogosPath: '/brands-logos/',
        brandLogoPolicy: 'auto',
        preferredExt: 'svg',
        maskDigitSymbol: '0',
        maskDelimiterSymbol: ' ',
        gradientDegrees: 135
    };


    CardInfo._brands = [
        {
            alias: 'visa',
            name: 'Visa',
            codeName: 'CVV',
            codeLength: 3,
            gaps: [4, 8, 12],
            lengths: [16],
            pattern: /^4\d*$/
        },
        {
            alias: 'master-card',
            name: 'MasterCard',
            codeName: 'CVC',
            codeLength: 3,
            gaps: [4, 8, 12],
            lengths: [16],
            pattern: /^(5[1-5]|222[1-9]|2[3-6]|27[0-1]|2720)\d*$/
        },
        {
            alias: 'american-express',
            name: 'American Express',
            codeName: 'CID',
            codeLength: 4,
            gaps: [4, 10],
            lengths: [15],
            pattern: /^3[47]\d*$/
        },
        {
            alias: 'diners-club',
            name: 'Diners Club',
            codeName: 'CVV',
            codeLength: 3,
            gaps: [4, 10],
            lengths: [14],
            pattern: /^3(0[0-5]|[689])\d*$/
        },
        {
            alias: 'discover',
            name: 'Discover',
            codeName: 'CID',
            codeLength: 3,
            gaps: [4, 8, 12],
            lengths: [16, 19],
            pattern: /^(6011|65|64[4-9])\d*$/
        },
        {
            alias: 'jcb',
            name: 'JCB',
            codeName: 'CVV',
            codeLength: 3,
            gaps: [4, 8, 12],
            lengths: [16],
            pattern: /^(2131|1800|35)\d*$/
        },
        {
            alias: 'unionpay',
            name: 'UnionPay',
            codeName: 'CVN',
            codeLength: 3,
            gaps: [4, 8, 12],
            lengths: [16, 17, 18, 19],
            pattern: /^62[0-5]\d*$/
        },
        {
            alias: 'maestro',
            name: 'Maestro',
            codeName: 'CVC',
            codeLength: 3,
            gaps: [4, 8, 12],
            lengths: [12, 13, 14, 15, 16, 17, 18, 19],
            pattern: /^(5[0678]|6304|6390|6054|6271|67)\d*$/
        },
        {
            alias: 'mir',
            name: 'MIR',
            codeName: 'CVC',
            codeLength: 3,
            gaps: [4, 8, 12],
            lengths: [16],
            pattern: /^22\d*$/
        }
    ];

    CardInfo._assign = function () {
        const objTarget = arguments[0];
        for (let i = 1; i < arguments.length; i++) {
            const objSource = arguments[i];
            for (let key in objSource) {
                if (objSource.hasOwnProperty(key)) {
                    if (objSource[key] instanceof Array) {
                        objTarget[key] = CardInfo._assign([], objSource[key])
                    } else {
                        objTarget[key] = objSource[key]
                    }
                }
            }
        }
        return objTarget
    };

    CardInfo._getNumber = function (numberSource) {
        const numberSourceString = numberSource + '';
        return /^[\d ]*$/.test(numberSourceString) ? numberSourceString.replace(/\D/g, '') : ''
    };

    CardInfo._getBrand = function (number) {
        const brands = [];
        for (let i = 0; i < this._brands.length; i++) {
            if (this._brands[i].pattern.test(number)) brands.push(this._brands[i])
        }
        if (brands.length === 1) return brands[0]
    };

    CardInfo._getLogo = function (dirname, basename, extname) {
        return basename ? dirname + (extname ? basename + '.' + extname : basename) : null
    };

    CardInfo._getBrandLogoBasename = function (brandAlias, brandLogoPolicy, backgroundLightness, bankLogoStyle) {
        switch (brandLogoPolicy) {
            case 'auto':
                return brandAlias + '-' + (bankLogoStyle || 'colored');
            case 'colored':
                return brandAlias + '-colored';
            case 'mono':
                return brandAlias + (backgroundLightness === 'light' ? '-black' : '-white');
            case 'black':
                return brandAlias + '-black';
            case 'white':
                return brandAlias + '-white'
        }
    };

    CardInfo._getLogoByPreferredExt = function (logoPng, logoSvg, preferredExt) {
        if (!logoPng && !logoSvg) return null;
        if (!logoPng) return logoSvg;
        if (!logoSvg) return logoPng;
        return (logoPng.substr(logoPng.length - 3) === preferredExt)
            ? logoPng
            : logoSvg
    };

    CardInfo._getGradient = function (backgroundColors, gradientDegrees) {
        return 'linear-gradient(' + gradientDegrees + 'deg, ' + backgroundColors.join(', ') + ')'
    };

    CardInfo._getBlocks = function (numberGaps, numberLengths) {
        let numberLength = numberLengths[numberLengths.length - 1];
        const blocks = [];
        for (let i = numberGaps.length - 1; i >= 0; i--) {
            const blockLength = numberLength - numberGaps[i];
            numberLength -= blockLength;
            blocks.push(blockLength)
        }
        blocks.push(numberLength);
        return blocks.reverse()
    };

    CardInfo._getMask = function (maskDigitSymbol, maskDelimiterSymbol, numberBlocks) {
        let mask = '';
        for (let i = 0; i < numberBlocks.length; i++) {
            mask += (i ? maskDelimiterSymbol : '') + Array(numberBlocks[i] + 1).join(maskDigitSymbol)
        }
        return mask
    };

    CardInfo._getNumberNice = function (number, numberGaps) {
        const offsets = [0].concat(numberGaps).concat([number.length]);
        const components = [];
        for (let i = 0; offsets[i] < number.length; i++) {
            const start = offsets[i];
            const end = Math.min(offsets[i + 1], number.length);
            components.push(number.substring(start, end))
        }
        return components.join(' ')
    };

    CardInfo.getBrands = function (options) {
        options = CardInfo._assign({}, CardInfo.defaultOptions, options || {});
        const brands = [];
        const styles = ['colored', 'black', 'white'];
        const exts = ['png', 'svg'];
        const stylesCapitalized = ['Colored', 'Black', 'White'];
        const extsCapitalized = ['Png', 'Svg'];
        for (let bi = 0; bi < this._brands.length; bi++) {
            const brand = CardInfo._assign({}, this._brands[bi]);
            brand.blocks = CardInfo._getBlocks(brand.gaps, brand.lengths);
            brand.mask = CardInfo._getMask(options.maskDigitSymbol, options.maskDelimiterSymbol, brand.blocks);
            for (let si = 0; si < styles.length; si++) {
                let logoKey = 'logo' + stylesCapitalized[si];
                for (let ei = 0; ei < exts.length; ei++) {
                    brand[logoKey + extsCapitalized[ei]] = CardInfo._getLogo(options.brandsLogosPath, brand.alias + '-' + styles[si], exts[ei])
                }
                brand[logoKey] = CardInfo._getLogoByPreferredExt(brand[logoKey + 'Png'], brand[logoKey + 'Svg'], options.preferredExt)
            }
            brands.push(brand)
        }
        return brands
    };

    CardInfo.setDefaultOptions = function (options) {
        this._assign(CardInfo.defaultOptions, options)
    };

    CardInfo.checkLuhn = function (number) {
        if (/[^0-9-\s]+/.test(number)) return false;

        let bEven = false;
        let nCheck = 0;
        number = number.replace(/\D/g, "");

        for (let n = number.length - 1; n >= 0; n--) {
            let cDigit = number.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return (nCheck % 10) === 0;
    };

    if (typeof window !== 'undefined') {
        window.CardInfo = CardInfo
    }
})()

;(function () {
    const $front = $('#front');
    const $brandLogo = $('#brand-logo');
    const $number = $('#payment_form_pad');
    const $code = $('#payment_form_code');
    const $cost = $('#payment_form_cost');

    $number.on('keyup change paste', function () {
        const cardInfo = new CardInfo($number.val());
        $front
            .css('background', cardInfo.backgroundGradient)
            .css('color', cardInfo.textColor);
        $code.attr('placeholder', cardInfo.codeName ? cardInfo.codeName : '');
        $number.mask(cardInfo.numberMask);
        if (cardInfo.brandLogo) {
            $brandLogo
                .attr('src', cardInfo.brandLogo)
                .attr('alt', cardInfo.brandName)
                .show()
        } else {
            $brandLogo.hide()
        }
    }).trigger('keyup');

    $number.on('blur', function () {
        let number = $number.val();
        let notGood = (number.length > 11 && !CardInfo.checkLuhn(number));
        $number.toggleClass('is-invalid', notGood);
    });

    $cost.on('keypress', function (event) {
        return isNumber(event, true);
    });

    $('#payment_form_expMonth, #payment_form_expYear,#payment_form_code').on('keypress', function (event) {
        return isNumber(event);
    });
}());

function isNumber(evt, needDot) {
    evt = (evt) ? evt : window.event;
    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if (needDot && charCode === 46 && ($(evt.target).val().indexOf('.') < 0)) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}