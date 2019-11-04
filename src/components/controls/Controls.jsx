import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Navbar, Nav, NavItem } from 'shards-react';
import UserIcon from './UserIcon';
import Rooms from './Rooms';
import Content from './Content';


export default function Controls({ user, room, changeRoom }) {
	const [roomsOpen, setRoomsOpen] = useState(false);
	const [contentOpen, setContentOpen] = useState(false);
	const [friendsOpen, setFriendsOpen] = useState(false);
	return (
		<div>
			<Container style={{}}>
				<Row>
					<Col sm="12">
						<Nav fill>
							<NavItem>
								<Button onClick={() => { setRoomsOpen(!roomsOpen) }}>Rooms</Button>
							</NavItem>
							<NavItem>
								<Button onClick={() => { setContentOpen(!contentOpen) }}>Content</Button>
							</NavItem>
							<NavItem>
								<Button onClick={() => { setFriendsOpen(!friendsOpen) }}>Friends</Button>
							</NavItem>
							<NavItem>
								<UserIcon user={user} />
							</NavItem>
						</Nav>
					</Col>
				</Row>
				<Row>
				</Row>
			</Container>
			<Rooms user={user} currentRoom={room} changeRoom={changeRoom} open={roomsOpen} toggle={() => { setRoomsOpen(!roomsOpen) }} />
			<Content room={room} open={contentOpen} toggle={() => { setContentOpen(!contentOpen) }} />
		</div >
	);
}