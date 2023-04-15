"use strict";
class MessageQueue {
    constructor() {
        this.messages = [];
    }
    dequeue() {
        var message = this.messages[0];
        this.messages.splice(0, 1);
        return message;
    }
    enqueue(message) {
        this.messages.push(message);
    }
    hasMessages() {
        return (this.messages.length > 0);
    }
}
