# Clean Architecture in Typescript

The starting point of this project was to enable me to learn Clean Architecture principles. I've made an effort to adhere to these principles to the best of my understanding. However, it's important to note that this code may not necessarily represent the best way to adhere to these principles.

## Folder Structure

I've organized the project by feature, opting for dedicated "Domain," "Application," and "Infrastructure" folders within each feature. This structure enhances readability, making it easier to locate and work on specific features without navigating through an extensive directory hierarchy. Any shared components or resources are centralized in the "Common" folder.

## Validation

I've chosen to validate entities on demand within use cases rather than automatically validating entities upon creation or update within the entity itself.

This approach helps avoid validation issues when a repository needs to create an instance of an entity in case the validation rules have changed. For example: if a database contains a password of 6 characters and the validation rule is updated to require a minimum of 8 characters, the repository would no longer be able to create the entity.

Alternatively, I could have employed two static factory methods, "create" and "createWithValidation," within the entity. However, I prefer allowing the use case to decide whether validation is necessary.

## Result Object

Instead of relying on exceptions, I utilize result objects to encapsulate success or failure information, returned from the use case. This method promotes a more predictable control flow, allowing for clear handling of expected error conditions in controllers.

The use of result objects facilitates testing, providing a more straightforward testing process compared to exceptions, which are often more challenging to test. Exceptions are reserved for truly exceptional situations, indicating unexpected and serious problems in the application.

## Inversion of Control (IOC)

For handling nversion of control, I utilize Inversify. While I stick to the basics of Inversify, more information can be found at https://inversify.io/.

## Testing

I view tests as an integral part of the application. Consequently, test files are placed in close proximity to the code they assess, rather than being relegated to a separate "test" folder. This approach ensures that when the source code is updated, it's easy to locate and update the corresponding test.

## Areas for Improvement

- The App class performs multiple tasks and could potentially be split into distinct classes (e.g., AppServer, AppDatabase, and AppContainer).

- Consider moving error handling in the controllers to a dedicated class for improved organization.

- Find a better approach to select the request handlers for each route, perhaps utilizing decorators.

- Remove the decorators in the entity to achieve a better separation of concerns.

- Explore Inversify further, and consider leveraging Modules for a more structured approach.
