import { Result } from '../../domain/results/result'

export interface UseCase<T, E = any> {
  execute(...args: any[]): Promise<Result<T, E>>
}
