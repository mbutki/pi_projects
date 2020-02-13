#include "lib/effect_runner.h"
#include "rings.h"

int main(int argc, char **argv)
{
    RingsEffect e("data/glass.png");

    EffectRunner r;
    r.addEffect(&e);

    r.setLayout("../layouts/triangle16.json");
    return r.main(argc, argv);
}
