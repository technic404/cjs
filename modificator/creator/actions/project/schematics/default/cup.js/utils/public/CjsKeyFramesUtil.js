const CJS_KEYFRAMES_ANIMATIONS = []; // { hash: number, animation: string }
const CJS_KEYFRAMES_CLASSES = []; // { hash: number, class: string }

class CjsKeyFrame {
    constructor() {
        this.entries = [];
        this.duration = 1000;
        this.timingFunction = 'ease';
        this.keepEndingEntryStyle = true;
        this.selector = '';
        this.isImportant = false;
    }

    /**
     * Set selector of class, so the animation could be applied to child divs if for example selector is ".animationClass > div"
     * @param {String} selector
     * @returns {CjsKeyFrame}
     */
    setSelector(selector) {
        this.selector = selector;

        return this;
    }

    /**
     *
     * @param {boolean} keepEntry
     * @returns {CjsKeyFrame}
     */
    setEndingEntryStyle(keepEntry) {
        this.keepEndingEntryStyle = keepEntry;

        return this;
    }

    /**
     *
     * @param {{accentColor?: string, additiveSymbols?: string, alignContent?: string, alignItems?: string, alignSelf?: string, alignmentBaseline?: string, all?: string, animation?: string, animationComposition?: string, animationDelay?: string, animationDirection?: string, animationDuration?: string, animationFillMode?: string, animationIterationCount?: string, animationName?: string, animationPlayState?: string, animationRange?: string, animationRangeEnd?: string, animationRangeStart?: string, animationTimeline?: string, animationTimingFunction?: string, appRegion?: string, appearance?: string, ascentOverride?: string, aspectRatio?: string, backdropFilter?: string, backfaceVisibility?: string, background?: string, backgroundAttachment?: string, backgroundBlendMode?: string, backgroundClip?: string, backgroundColor?: string, backgroundImage?: string, backgroundOrigin?: string, backgroundPosition?: string, backgroundPositionX?: string, backgroundPositionY?: string, backgroundRepeat?: string, backgroundRepeatX?: string, backgroundRepeatY?: string, backgroundSize?: string, basePalette?: string, baselineShift?: string, baselineSource?: string, blockSize?: string, border?: string, borderBlock?: string, borderBlockColor?: string, borderBlockEnd?: string, borderBlockEndColor?: string, borderBlockEndStyle?: string, borderBlockEndWidth?: string, borderBlockStart?: string, borderBlockStartColor?: string, borderBlockStartStyle?: string, borderBlockStartWidth?: string, borderBlockStyle?: string, borderBlockWidth?: string, borderBottom?: string, borderBottomColor?: string, borderBottomLeftRadius?: string, borderBottomRightRadius?: string, borderBottomStyle?: string, borderBottomWidth?: string, borderCollapse?: string, borderColor?: string, borderEndEndRadius?: string, borderEndStartRadius?: string, borderImage?: string, borderImageOutset?: string, borderImageRepeat?: string, borderImageSlice?: string, borderImageSource?: string, borderImageWidth?: string, borderInline?: string, borderInlineColor?: string, borderInlineEnd?: string, borderInlineEndColor?: string, borderInlineEndStyle?: string, borderInlineEndWidth?: string, borderInlineStart?: string, borderInlineStartColor?: string, borderInlineStartStyle?: string, borderInlineStartWidth?: string, borderInlineStyle?: string, borderInlineWidth?: string, borderLeft?: string, borderLeftColor?: string, borderLeftStyle?: string, borderLeftWidth?: string, borderRadius?: string, borderRight?: string, borderRightColor?: string, borderRightStyle?: string, borderRightWidth?: string, borderSpacing?: string, borderStartEndRadius?: string, borderStartStartRadius?: string, borderStyle?: string, borderTop?: string, borderTopColor?: string, borderTopLeftRadius?: string, borderTopRightRadius?: string, borderTopStyle?: string, borderTopWidth?: string, borderWidth?: string, bottom?: string, boxShadow?: string, boxSizing?: string, breakAfter?: string, breakBefore?: string, breakInside?: string, bufferedRendering?: string, captionSide?: string, caretColor?: string, clear?: string, clip?: string, clipPath?: string, clipRule?: string, color?: string, colorInterpolation?: string, colorInterpolationFilters?: string, colorRendering?: string, colorScheme?: string, columnCount?: string, columnFill?: string, columnGap?: string, columnRule?: string, columnRuleColor?: string, columnRuleStyle?: string, columnRuleWidth?: string, columnSpan?: string, columnWidth?: string, columns?: string, contain?: string, containIntrinsicBlockSize?: string, containIntrinsicHeight?: string, containIntrinsicInlineSize?: string, containIntrinsicSize?: string, containIntrinsicWidth?: string, container?: string, containerName?: string, containerType?: string, content?: string, contentVisibility?: string, counterIncrement?: string, counterReset?: string, counterSet?: string, cursor?: string, cx?: string, cy?: string, d?: string, descentOverride?: string, direction?: string, display?: string, dominantBaseline?: string, emptyCells?: string, fallback?: string, fill?: string, fillOpacity?: string, fillRule?: string, filter?: string, flex?: string, flexBasis?: string, flexDirection?: string, flexFlow?: string, flexGrow?: string, flexShrink?: string, flexWrap?: string, float?: string, floodColor?: string, floodOpacity?: string, font?: string, fontDisplay?: string, fontFamily?: string, fontFeatureSettings?: string, fontKerning?: string, fontOpticalSizing?: string, fontPalette?: string, fontSize?: string, fontStretch?: string, fontStyle?: string, fontSynthesis?: string, fontSynthesisSmallCaps?: string, fontSynthesisStyle?: string, fontSynthesisWeight?: string, fontVariant?: string, fontVariantAlternates?: string, fontVariantCaps?: string, fontVariantEastAsian?: string, fontVariantLigatures?: string, fontVariantNumeric?: string, fontVariationSettings?: string, fontWeight?: string, forcedColorAdjust?: string, gap?: string, grid?: string, gridArea?: string, gridAutoColumns?: string, gridAutoFlow?: string, gridAutoRows?: string, gridColumn?: string, gridColumnEnd?: string, gridColumnGap?: string, gridColumnStart?: string, gridGap?: string, gridRow?: string, gridRowEnd?: string, gridRowGap?: string, gridRowStart?: string, gridTemplate?: string, gridTemplateAreas?: string, gridTemplateColumns?: string, gridTemplateRows?: string, height?: string, hyphenateCharacter?: string, hyphenateLimitChars?: string, hyphens?: string, imageOrientation?: string, imageRendering?: string, inherits?: string, initialLetter?: string, initialValue?: string, inlineSize?: string, inset?: string, insetBlock?: string, insetBlockEnd?: string, insetBlockStart?: string, insetInline?: string, insetInlineEnd?: string, insetInlineStart?: string, isolation?: string, justifyContent?: string, justifyItems?: string, justifySelf?: string, left?: string, letterSpacing?: string, lightingColor?: string, lineBreak?: string, lineGapOverride?: string, lineHeight?: string, listStyle?: string, listStyleImage?: string, listStylePosition?: string, listStyleType?: string, margin?: string, marginBlock?: string, marginBlockEnd?: string, marginBlockStart?: string, marginBottom?: string, marginInline?: string, marginInlineEnd?: string, marginInlineStart?: string, marginLeft?: string, marginRight?: string, marginTop?: string, marker?: string, markerEnd?: string, markerMid?: string, markerStart?: string, mask?: string, maskType?: string, mathDepth?: string, mathShift?: string, mathStyle?: string, maxBlockSize?: string, maxHeight?: string, maxInlineSize?: string, maxWidth?: string, minBlockSize?: string, minHeight?: string, minInlineSize?: string, minWidth?: string, mixBlendMode?: string, negative?: string, objectFit?: string, objectPosition?: string, objectViewBox?: string, offset?: string, offsetAnchor?: string, offsetDistance?: string, offsetPath?: string, offsetPosition?: string, offsetRotate?: string, opacity?: string, order?: string, orphans?: string, outline?: string, outlineColor?: string, outlineOffset?: string, outlineStyle?: string, outlineWidth?: string, overflow?: string, overflowAnchor?: string, overflowClipMargin?: string, overflowWrap?: string, overflowX?: string, overflowY?: string, overrideColors?: string, overscrollBehavior?: string, overscrollBehaviorBlock?: string, overscrollBehaviorInline?: string, overscrollBehaviorX?: string, overscrollBehaviorY?: string, pad?: string, padding?: string, paddingBlock?: string, paddingBlockEnd?: string, paddingBlockStart?: string, paddingBottom?: string, paddingInline?: string, paddingInlineEnd?: string, paddingInlineStart?: string, paddingLeft?: string, paddingRight?: string, paddingTop?: string, page?: string, pageBreakAfter?: string, pageBreakBefore?: string, pageBreakInside?: string, pageOrientation?: string, paintOrder?: string, perspective?: string, perspectiveOrigin?: string, placeContent?: string, placeItems?: string, placeSelf?: string, pointerEvents?: string, position?: string, prefix?: string, quotes?: string, r?: string, range?: string, resize?: string, right?: string, rotate?: string, rowGap?: string, rubyPosition?: string, rx?: string, ry?: string, scale?: string, scrollBehavior?: string, scrollMargin?: string, scrollMarginBlock?: string, scrollMarginBlockEnd?: string, scrollMarginBlockStart?: string, scrollMarginBottom?: string, scrollMarginInline?: string, scrollMarginInlineEnd?: string, scrollMarginInlineStart?: string, scrollMarginLeft?: string, scrollMarginRight?: string, scrollMarginTop?: string, scrollPadding?: string, scrollPaddingBlock?: string, scrollPaddingBlockEnd?: string, scrollPaddingBlockStart?: string, scrollPaddingBottom?: string, scrollPaddingInline?: string, scrollPaddingInlineEnd?: string, scrollPaddingInlineStart?: string, scrollPaddingLeft?: string, scrollPaddingRight?: string, scrollPaddingTop?: string, scrollSnapAlign?: string, scrollSnapStop?: string, scrollSnapType?: string, scrollTimeline?: string, scrollTimelineAxis?: string, scrollTimelineName?: string, scrollbarGutter?: string, shapeImageThreshold?: string, shapeMargin?: string, shapeOutside?: string, shapeRendering?: string, size?: string, sizeAdjust?: string, speak?: string, speakAs?: string, src?: string, stopColor?: string, stopOpacity?: string, stroke?: string, strokeDasharray?: string, strokeDashoffset?: string, strokeLinecap?: string, strokeLinejoin?: string, strokeMiterlimit?: string, strokeOpacity?: string, strokeWidth?: string, suffix?: string, symbols?: string, syntax?: string, system?: string, tabSize?: string, tableLayout?: string, textAlign?: string, textAlignLast?: string, textAnchor?: string, textCombineUpright?: string, textDecoration?: string, textDecorationColor?: string, textDecorationLine?: string, textDecorationSkipInk?: string, textDecorationStyle?: string, textDecorationThickness?: string, textEmphasis?: string, textEmphasisColor?: string, textEmphasisPosition?: string, textEmphasisStyle?: string, textIndent?: string, textOrientation?: string, textOverflow?: string, textRendering?: string, textShadow?: string, textSizeAdjust?: string, textTransform?: string, textUnderlineOffset?: string, textUnderlinePosition?: string, textWrap?: string, timelineScope?: string, top?: string, touchAction?: string, transform?: string, transformBox?: string, transformOrigin?: string, transformStyle?: string, transition?: string, transitionDelay?: string, transitionDuration?: string, transitionProperty?: string, transitionTimingFunction?: string, translate?: string, unicodeBidi?: string, unicodeRange?: string, userSelect?: string, vectorEffect?: string, verticalAlign?: string, viewTimeline?: string, viewTimelineAxis?: string, viewTimelineInset?: string, viewTimelineName?: string, viewTransitionName?: string, visibility?: string, webkitAlignContent?: string, webkitAlignItems?: string, webkitAlignSelf?: string, webkitAnimation?: string, webkitAnimationDelay?: string, webkitAnimationDirection?: string, webkitAnimationDuration?: string, webkitAnimationFillMode?: string, webkitAnimationIterationCount?: string, webkitAnimationName?: string, webkitAnimationPlayState?: string, webkitAnimationTimingFunction?: string, webkitAppRegion?: string, webkitAppearance?: string, webkitBackfaceVisibility?: string, webkitBackgroundClip?: string, webkitBackgroundOrigin?: string, webkitBackgroundSize?: string, webkitBorderAfter?: string, webkitBorderAfterColor?: string, webkitBorderAfterStyle?: string, webkitBorderAfterWidth?: string, webkitBorderBefore?: string, webkitBorderBeforeColor?: string, webkitBorderBeforeStyle?: string, webkitBorderBeforeWidth?: string, webkitBorderBottomLeftRadius?: string, webkitBorderBottomRightRadius?: string, webkitBorderEnd?: string, webkitBorderEndColor?: string, webkitBorderEndStyle?: string, webkitBorderEndWidth?: string, webkitBorderHorizontalSpacing?: string, webkitBorderImage?: string, webkitBorderRadius?: string, webkitBorderStart?: string, webkitBorderStartColor?: string, webkitBorderStartStyle?: string, webkitBorderStartWidth?: string, webkitBorderTopLeftRadius?: string, webkitBorderTopRightRadius?: string, webkitBorderVerticalSpacing?: string, webkitBoxAlign?: string, webkitBoxDecorationBreak?: string, webkitBoxDirection?: string, webkitBoxFlex?: string, webkitBoxOrdinalGroup?: string, webkitBoxOrient?: string, webkitBoxPack?: string, webkitBoxReflect?: string, webkitBoxShadow?: string, webkitBoxSizing?: string, webkitClipPath?: string, webkitColumnBreakAfter?: string, webkitColumnBreakBefore?: string, webkitColumnBreakInside?: string, webkitColumnCount?: string, webkitColumnGap?: string, webkitColumnRule?: string, webkitColumnRuleColor?: string, webkitColumnRuleStyle?: string, webkitColumnRuleWidth?: string, webkitColumnSpan?: string, webkitColumnWidth?: string, webkitColumns?: string, webkitFilter?: string, webkitFlex?: string, webkitFlexBasis?: string, webkitFlexDirection?: string, webkitFlexFlow?: string, webkitFlexGrow?: string, webkitFlexShrink?: string, webkitFlexWrap?: string, webkitFontFeatureSettings?: string, webkitFontSmoothing?: string, webkitHighlight?: string, webkitHyphenateCharacter?: string, webkitJustifyContent?: string, webkitLineBreak?: string, webkitLineClamp?: string, webkitLocale?: string, webkitLogicalHeight?: string, webkitLogicalWidth?: string, webkitMarginAfter?: string, webkitMarginBefore?: string, webkitMarginEnd?: string, webkitMarginStart?: string, webkitMask?: string, webkitMaskBoxImage?: string, webkitMaskBoxImageOutset?: string, webkitMaskBoxImageRepeat?: string, webkitMaskBoxImageSlice?: string, webkitMaskBoxImageSource?: string, webkitMaskBoxImageWidth?: string, webkitMaskClip?: string, webkitMaskComposite?: string, webkitMaskImage?: string, webkitMaskOrigin?: string, webkitMaskPosition?: string, webkitMaskPositionX?: string, webkitMaskPositionY?: string, webkitMaskRepeat?: string, webkitMaskRepeatX?: string, webkitMaskRepeatY?: string, webkitMaskSize?: string, webkitMaxLogicalHeight?: string, webkitMaxLogicalWidth?: string, webkitMinLogicalHeight?: string, webkitMinLogicalWidth?: string, webkitOpacity?: string, webkitOrder?: string, webkitPaddingAfter?: string, webkitPaddingBefore?: string, webkitPaddingEnd?: string, webkitPaddingStart?: string, webkitPerspective?: string, webkitPerspectiveOrigin?: string, webkitPerspectiveOriginX?: string, webkitPerspectiveOriginY?: string, webkitPrintColorAdjust?: string, webkitRtlOrdering?: string, webkitRubyPosition?: string, webkitShapeImageThreshold?: string, webkitShapeMargin?: string, webkitShapeOutside?: string, webkitTapHighlightColor?: string, webkitTextCombine?: string, webkitTextDecorationsInEffect?: string, webkitTextEmphasis?: string, webkitTextEmphasisColor?: string, webkitTextEmphasisPosition?: string, webkitTextEmphasisStyle?: string, webkitTextFillColor?: string, webkitTextOrientation?: string, webkitTextSecurity?: string, webkitTextSizeAdjust?: string, webkitTextStroke?: string, webkitTextStrokeColor?: string, webkitTextStrokeWidth?: string, webkitTransform?: string, webkitTransformOrigin?: string, webkitTransformOriginX?: string, webkitTransformOriginY?: string, webkitTransformOriginZ?: string, webkitTransformStyle?: string, webkitTransition?: string, webkitTransitionDelay?: string, webkitTransitionDuration?: string, webkitTransitionProperty?: string, webkitTransitionTimingFunction?: string, webkitUserDrag?: string, webkitUserModify?: string, webkitUserSelect?: string, webkitWritingMode?: string, whiteSpace?: string, whiteSpaceCollapse?: string, widows?: string, width?: string, willChange?: string, wordBreak?: string, wordSpacing?: string, wordWrap?: string, writingMode?: string, x?: string, y?: string, zIndex?: string, zoom?: string}} style
     * @returns {CjsKeyFrame}
     */
    addEntry(style) {
        this.entries.push(style);

        return this;
    }

    /**
     *
     * @param {Number} duration animation time in ms
     * @return {CjsKeyFrame}
     */
    setDuration(duration) {
        if(isNaN(duration)) {
            console.log(`${CJS_PRETTY_PREFIX_X} Provided argument is not a number`);
        }

        this.duration = duration;

        return this;
    }

    /**
     *
     * @param {"linear"|"ease"|"ease-in"|"ease-out"|"ease-in-out"} timingFunction
     * @return {CjsKeyFrame}
     */
    setTimingFunction(timingFunction) {
        this.timingFunction = timingFunction;

        return this;
    }

    /**
     *
     * @param {Boolean} isImportant
     * @return {CjsKeyFrame}
     */
    setImportant(isImportant) {
        this.isImportant = isImportant;

        return this;
    }

    /**
     *
     * @param {{reversed?: boolean}} options
     * @return {string}
     */
    getClass(options = { reversed: false }) {
        if(!("reversed" in options)) { options.reversed = false; }

        if(this.entries.length > 100) {
            console.log(`${CJS_PRETTY_PREFIX_X}CjsKeyFrame cannot have more than 100 entries`)
        }

        const directionDefinedEntries = ( options.reversed === true ? this.entries.slice().reverse() : this.entries );

        const entriesEachPercent = 100 / (directionDefinedEntries.length - 1);
        let parsedEntries = directionDefinedEntries.map((entry, i) => {
            const hasOneEntry = directionDefinedEntries.length === 1;
            const percent = hasOneEntry ? 100 : i * entriesEachPercent;

            return `    ${percent}% { ${Object.keys(entry).map(e => `${e}: ${entry[e]};`).join(" ")} }`
        });

        const entriesCss = `{ \n${parsedEntries.join("\n")} \n}`;
        const animationHash = getUniqueNumberId(entriesCss);
        const animationFilter = CJS_KEYFRAMES_ANIMATIONS.filter(e => e.hash === animationHash);
        const style = document.head.querySelector(`[id="${CJS_STYLE_KEYFRAMES_PREFIX}"]`);

        if(animationFilter.length === 0) {
            const animationName = `${CJS_STYLE_KEYFRAMES_PREFIX}${getRandomCharacters(CJS_ID_LENGTH)}`;
            const css = `@keyframes ${animationName} ${entriesCss}`;

            style.innerHTML += `\n${css}`;

            const object = { hash: animationHash, animation: animationName }

            CJS_KEYFRAMES_ANIMATIONS.push(object);

            animationFilter.push(object);
        }

        const animationName = animationFilter[0].animation;
        const lastEntry = directionDefinedEntries[directionDefinedEntries.length - 1];
        const importantProperty = `${(this.isImportant ? ' !important' : '')}`;
        const lastEntryStyle = `${Object.keys(lastEntry).map(e => `${e}: ${lastEntry[e]};`).join(" ")}`;
        const cssContentParts = [
            `animation: ${animationName} ${this.duration / 1000}s ${this.timingFunction}${importantProperty}`
        ];

        if(this.keepEndingEntryStyle) {
            cssContentParts.push(lastEntryStyle);
        }

        const classCssContent = `{ ${cssContentParts.join("; ")} }`;
        const classHash = getUniqueNumberId(`${this.selector}-${classCssContent}`);

        const classFilter = CJS_KEYFRAMES_CLASSES.filter(e => e.hash === classHash);

        if(classFilter.length === 0) {
            const className = `${animationName}-${classHash}`;
            const css = `.${className} ${this.selector} ${classCssContent}`;

            style.innerHTML += `\n${css}`;

            CJS_KEYFRAMES_CLASSES.push({ hash: classHash, class: className });

            return className;
        }

        return classFilter[0].class;
    }
}