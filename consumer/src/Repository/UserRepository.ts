import { getManager, InsertResult } from "typeorm";
import { User } from "../entity/User";


export class UserRepository {

    crearUsuarios(usuarios: User[]): Promise<InsertResult> {
        let arr: any[] = [];
        usuarios.forEach(element => {
            let valor = {
                name: element.name,
                email: element.email
            };
            arr.push(valor);
        });

        return getManager().createQueryBuilder()
            .insert()
            .into(User)
            .values(
               arr
            )
            .execute();
    }

    crearUsuario(usuario: User): Promise<User> {
        return getManager().getRepository(User).save(usuario);
    }

    obtenerListaUsuarios(): Promise<User[]> {
        return getManager().getRepository(User).createQueryBuilder('users')
            .select(['users.id', 'users.name', 'users.email'])
            .getMany();
    }

    obtenerUsuario(idUser: string): Promise<User> {
        return getManager().getRepository(User).findOneOrFail({
            where: {
                id: idUser
            }
        });
    }
}