import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Navbar, Nav, NavItem } from 'shards-react';
import UserIcon from './UserIcon';
import Rooms from './Rooms';
import Content from './Content';
import Friends from './Friends';


export default function Controls({ me, room, content, setRoom, setContent }) {
	const [roomsOpen, setRoomsOpen] = useState(false);
	const [contentOpen, setContentOpen] = useState(false);
	const [friendsOpen, setFriendsOpen] = useState(false);
	return (
		<div>
			<Container style={{ paddingBottom: '5px' }}>
				<Row>
					<Col sm="12">
						<Nav fill>
							<NavItem>
								<Button onClick={() => { setRoomsOpen(!roomsOpen) }}>Rooms</Button>
							</NavItem>
							<NavItem>
								<Button disabled={!room} onClick={() => { setContentOpen(!contentOpen) }}>Content</Button>
							</NavItem>
							<NavItem>
								<Button onClick={() => { setFriendsOpen(!friendsOpen) }}>Friends</Button>
							</NavItem>
							<NavItem>
								<UserIcon user={me} />
							</NavItem>
						</Nav>
					</Col>
				</Row>
			</Container>
			<Rooms me={me} currentRoom={room} setRoom={setRoom} open={roomsOpen} toggle={() => { setRoomsOpen(!roomsOpen) }} />
			<Content room={room} me={me} content={content} setContent={setContent} open={contentOpen} toggle={() => { setContentOpen(!contentOpen) }} />
			<Friends me={me} room={room} open={friendsOpen} toggle={() => { setFriendsOpen(!friendsOpen) }} />
		</div >
	);
}