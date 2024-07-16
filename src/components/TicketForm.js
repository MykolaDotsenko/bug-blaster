import React, {useState} from'react';

export default function TicketForm() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('1');


    const priorityLabels = {
        '1': 'Low',
        '2': 'Medium',
        '3': 'High'
    }


    const clearForm = () => {
        setTitle('');
        setDescription('');
        setPriority('1');
    }


    return (<></>)
}