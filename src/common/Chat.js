import React, { Text } from 'react-native'
import { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Day } from 'react-native-gifted-chat'

const Chat = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 22,
                text: 'Hello developer 2',
                createdAt: new Date('2023-01-01 20:00:00'),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://assets.ayobandung.com/crop/0x0:0x0/750x500/webp/photo/2022/10/09/2589705922.jpg',
                },
            },
            {
                _id: 33,
                text: 'Hello developer',
                createdAt: new Date('2023-01-01 07:00:00'),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://assets.ayobandung.com/crop/0x0:0x0/750x500/webp/photo/2022/10/09/2589705922.jpg',
                },
            },
            {
                _id: 34,
                text: 'Hello developer',
                createdAt: new Date('2023-03-22 07:00:00'),
                user: {
                    _id: 1,
                    name: 'React Native',
                    avatar: 'https://assets.ayobandung.com/crop/0x0:0x0/750x500/webp/photo/2022/10/09/2589705922.jpg',
                },
            }
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            renderDay={(props) => {
                console.log('===a');
                console.log(props);
                console.log('===b');
                return <Day {...props} />
            }}
        />
    )
}

export default Chat