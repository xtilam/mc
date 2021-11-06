import { Button, ListItemText, Menu, MenuItem } from "@mui/material";
import React from "react";
import { utils } from "../common/utils";
import { $MButtonProps, $MListItemText, $MMenuProps } from "../declare";

export default class DropDownButton extends React.Component<DropdownButtonProps, DropdownButtonState>{
    constructor(props) {
        super(props)
        this.state = {} as any
    }
    render() {
        let { menu, button } = this.props
        const open = Boolean(this.state.anchorEl)
        if (!menu) menu = {} as any
        return <>
            <Button
                {...button}
                onClick={(e) => {
                    this.setState({ anchorEl: e.currentTarget })
                }}
            />
            <Menu
                {...menu}
                onClick={(e) => {
                    this.setState({ anchorEl: null })
                    menu.onClick && menu?.onClick(e)
                }}
                anchorEl={this.state.anchorEl}
                open={open}
            >
                {this.props.items.map((itemProps, index) => {
                    return <MenuItem key={index} onClick={itemProps.onClick}>
                        <ListItemText  {...{ ...itemProps, onClick: undefined }} />
                    </MenuItem>
                }
                )}
            </Menu>
        </>
    }
}

interface DropdownButtonProps {
    button: $MButtonProps
    menu?: $MMenuProps
    items: $MListItemText[]
}

interface DropdownButtonState {
    anchorEl: HTMLElement
}