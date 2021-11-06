import React from "react";

const svgLink = {
    'menu': 'menu',
    'user': 'user',
    'close': 'close',

}

interface SVGProps extends React.SVGAttributes<SVGElement> {
    type: keyof (typeof svgLink)
}

export default class SVG extends React.Component<SVGProps> {
    specialAttribute = {
        class: 'className'
    }

    svgRef: React.RefObject<SVGElement>
    svgString: string
    propsSVG: any

    constructor(props: SVGProps) {
        super(props)
        this.state = {
            svg: null
        }

        this.svgRef = React.createRef()
    }
    svgMount(e) {
        this.svgString = e.target.contentDocument.querySelector('svg')
        this.generateSVG()
    }
    componentDidUpdate() {
        if (this.svgString) {
            this.svgRef.current.innerHTML += this.svgString
        }
    }
    shouldComponentUpdate() {
        let mapColor = []

        const { color, fill, stroke } = this.props

        if (color) {
            mapColor.push('stroke')
            mapColor.push('fill')
            this.propsSVG.fill = fill || color
            this.propsSVG.stroke = stroke || color
        } else {
            stroke && mapColor.push('stroke')
            fill && mapColor.push('fill')
        }



        mapColor.forEach((attr) => {
            this.svgString = this.svgString.replace(new RegExp(`${attr}=\".*?\"`, 'g'), '')
        })

        return true
    }
    generateSVG() {
        if (this.svgString) {
            const svg: HTMLElement = this.svgString as any

            let props = {}
            for (const attr of svg.getAttributeNames()) {
                const attributeReactName = this.transformAttribute(attr)
                props[attributeReactName] = svg.getAttribute(attr)
            }
            this.propsSVG = { ...props, ...this.props, ref: this.svgRef }

            this.svgString = svg.innerHTML

            this.setState({})
        }
    }
    transformAttribute(attr: string) {
        return this.specialAttribute[attr] ?? attr.replace(/[-:](.)/g, (v) => v[1].toUpperCase())
    }
    render() {
        const { props: p } = this
        return (
            this.svgString ? <svg {...this.propsSVG} /> : <object style={{ width: 0, height: 0 }} type="image/svg+xml" data={`/svg/${p.type}.svg`} onLoad={this.svgMount.bind(this)}></object>
        )
    }
}