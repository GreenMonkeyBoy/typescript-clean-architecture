export interface DatabaseConnector {
  connect(...args: any[]): Promise<void>
  disconnect(): Promise<void>
  clearDatabase(): Promise<void>
}
