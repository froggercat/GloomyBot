import { WarclockResponder } from "./services/warclock-responder";

export const TYPES = {
  Bot: Symbol("Bot"),
  Client: Symbol("Client"),
  Token: Symbol("Token"),
  MessageResponder: Symbol("MessageResponder"),
  PingFinder: Symbol("PingFinder"),
  ServerFinder: Symbol("ServerFinder"),
  WarclockFinder: Symbol("WarclockFinder"),
  GoogleAppCred: Symbol("GoogleAppCred"),
  DatabaseURL: Symbol("DatabaseURL"),
  FirebaseConnection: Symbol("FirebaseConnection"),
  WarclockResponder: Symbol("WarclockResponder"),
  WarclockDatabase: Symbol("WarclockDatabase")
};