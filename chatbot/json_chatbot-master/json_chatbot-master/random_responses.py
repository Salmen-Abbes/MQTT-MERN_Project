import random


def random_string():
    random_list = [
        "Veuillez essayer d'écrire quelque chose de plus descriptif.",
        "Oh! Il semble que tu aies écrit quelque chose que je ne comprends pas encore",
        "Cela vous dérangerait-il d'essayer de reformuler cela ?",
        "Je suis vraiment désolé, je n'ai pas bien compris.",
        "Je ne peux pas encore répondre, essayez de demander autre chose."
    ]

    list_count = len(random_list)
    random_item = random.randrange(list_count)

    return random_list[random_item]
