import { Menu } from "@mui/material";
import React, { Component } from "react";

export default class CreatePost extends Component<any, CreatePostState> {
    ref = React.createRef()
    listAutoComplete = []
    constructor(props) {
        super(props)
        this.state = {} as any
    }
    componentDidMount() {
        this.setState({ anchorEl: this.ref.current as any })
    }
    render() {
        return <div>
            <span contentEditable suppressContentEditableWarning={true} onInput={(e) => {
                console.log(e.currentTarget.textContent)
            }}>This is content</span>
            <span ref={this.ref as any}>{`{}`}</span>
            {
                (this.listAutoComplete.length
                    && <Menu open={true}
                        anchorEl={this.state.anchorEl}
                    >

                    </Menu>) || ''
            }
        </div >
    }
}

interface CreatePostState {
    anchorEl: HTMLSpanElement
}