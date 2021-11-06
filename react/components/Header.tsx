import { AppBar, Avatar, Badge, Button, Divider, Drawer, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, MenuList, Paper, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { utils } from "../common/utils";
import { route } from "../config/route";
import { AuthConsumer, User } from "../context/AuthProvider";
import CLink from "./custom/CLink";
import DropDownButton from "./DropdownButton";
import SVG from "./SVG";

export default class Header extends React.Component<{}, HeaderState> {
    menuId = utils.makeID(20)
    constructor(props) {
        super(props)
        this.state = {
            isOpenMenu: false
        }
    }

    toggle(status?) {
        return (() => {
            this.setState({ isOpenMenu: status })
        })
    }

    render() {
        const [openDraw, closeDraw] = [this.toggle(true).bind(this), this.toggle(false).bind(this)]
        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            onClick={openDraw}
                            sx={{ mr: 'auto' }}
                        >
                            <SVG type='menu' color="white" />
                        </IconButton>
                        <AuthConsumer children={
                            ({ user }) =>
                                !user
                                    ? <Button size="small" color="inherit" variant="outlined" className='btn-link'>
                                        <Link to={route.login}>Đăng nhập</Link>
                                    </Button>
                                    : <>
                                        <DropDownButton
                                            button={{ color: 'inherit', variant: 'outlined', children: user.name }}
                                            items={[
                                                { children: 'Tài khoản' },
                                                {
                                                    children: 'Đăng xuất', onClick() {
                                                        User.logout()
                                                    }
                                                },
                                            ]}
                                        />
                                    </>
                        } />

                    </Toolbar>
                </AppBar>
                <Grid>
                    <Drawer anchor="left" open={this.state.isOpenMenu} onClickCapture={closeDraw} >
                        <Grid container>
                            <Grid item sx={{ mr: 'auto' }} />
                            <Grid item sx={{ m: 2 }} className="m-hand" onClick={closeDraw}>
                                <SVG type="close" color="red" ></SVG>
                            </Grid>
                        </Grid>
                        <List>
                            <CLink to={route.home} {... {
                                children:
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText>Homepage</ListItemText>
                                    </ListItemButton>
                            }} />
                            <CLink to={route.createPost} {... {
                                children:
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText>WriteContent</ListItemText>
                                    </ListItemButton>
                            }} />

                            <Divider variant="middle" component="li" />
                        </List>
                    </Drawer>
                </Grid>
            </>
        )
    }
}

interface HeaderState {
    isOpenMenu: boolean
}