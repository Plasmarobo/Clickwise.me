Clickwise.me
------------

Try it out. 

Based on http://www.cogspace.com/clickwise/

The page is a simple input box with an settings dialog. 
Just start typing (you might want to hit enter when you're done, just to make sure it's all there).

Clocktalk is the only implemented dictionary (1:1 mapping). It is incomplete. Some letters will render as grey boxes. The resulting image is a png file which is totally save-able. 

Developers
----------

The interface could use some cleanup, but plugins for audio models, dictionaries, and profiles can be found in the src directories. To implement your own plugin, you simply register the model.

## Dictionary
Dictionaries are simple mappings from characters into a symbol type. There are between 1 and 6 dots, and 5 possible edges between them (dashes). This is subject to change as more is learned about clickwise and clocktalk.

## Profile
These determine how the symbols are rendered. The properties listed are the properties used. 
Relatively self-explanitory.

## Audio Model
Audio models are more internal. 
The render function, intitalize function, and connect functions are important. Everything else is up to the implementer.

What's next
-----------

* Page-parser/scriptlet

Contributions
-------------

Github allows pull requests!
Go ahead and contribute!
