import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import {Bus, Event, PublishedEvent} from 'typebridge';
import {FromSchema, JSONSchema} from "json-schema-to-ts";
import type { EventBridgeEvent } from 'aws-lambda';

export const MyBus = new Bus({
    name: 'applicationBus',
    EventBridge: new EventBridgeClient({}),
});

export const MyEventPayloadSchema = {
    type: 'object',
    properties: {
        stringAttribute: { type: 'string' },
        numberAttribute: { type: 'integer' },
    },
    required: ['stringAttribute'],
    additionalProperties: false
} as const;

export const MyEvent = new Event({
    name: 'MyEvent',
    bus: MyBus,
    schema: MyEventPayloadSchema,
    source: 'mySource'
});

type MyEventType = typeof MyEvent

export type MyPublishedEventType = PublishedEvent<MyEventType>
const myEvent: MyPublishedEventType = {}


type GenericEvent = Event<string, JSONSchema>;
export type CustomPublishedEvent<Event extends GenericEvent> = EventBridgeEvent<
    Event['name'],
    FromSchema<Event['schema']>
>;
export type MyPublishedEventType2 = CustomPublishedEvent<MyEventType>
const myEvent2: MyPublishedEventType2 = {}

